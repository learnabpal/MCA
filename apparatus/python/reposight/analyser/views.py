from pathlib import Path
import ast
import json
import re
import shutil
import tempfile
import zipfile

from django.shortcuts import render


LANGUAGE_EXTENSIONS = {
	'.py': 'Python',
	'.pyw': 'Python',
	'.java': 'Java',
	'.kt': 'Kotlin',
	'.kts': 'Kotlin',
	'.js': 'JavaScript',
	'.jsx': 'JavaScript',
	'.mjs': 'JavaScript',
	'.cjs': 'JavaScript',
	'.ts': 'TypeScript',
	'.tsx': 'TypeScript',
	'.c': 'C',
	'.h': 'C',
	'.cc': 'C++',
	'.cpp': 'C++',
	'.cxx': 'C++',
	'.hpp': 'C++',
	'.cs': 'C#',
	'.go': 'Go',
	'.rs': 'Rust',
	'.php': 'PHP',
	'.rb': 'Ruby',
	'.swift': 'Swift',
	'.dart': 'Dart',
	'.r': 'R',
	'.scala': 'Scala',
	'.sh': 'Shell',
	'.bash': 'Shell',
	'.zsh': 'Shell',
	'.fish': 'Shell',
	'.ps1': 'PowerShell',
	'.sql': 'SQL',
	'.html': 'HTML',
	'.htm': 'HTML',
	'.css': 'CSS',
	'.scss': 'SCSS',
	'.sass': 'Sass',
	'.less': 'Less',
	'.xml': 'XML',
	'.vue': 'Vue',
	'.svelte': 'Svelte',
}

COMMENT_MARKERS = {
	'Python': '#',
	'Ruby': '#',
	'Shell': '#',
	'PowerShell': '#',
	'R': '#',
	'Java': '//',
	'Kotlin': '//',
	'JavaScript': '//',
	'TypeScript': '//',
	'C': '//',
	'C++': '//',
	'C#': '//',
	'Go': '//',
	'Rust': '//',
	'PHP': '//',
	'Swift': '//',
	'Dart': '//',
	'Scala': '//',
}

IGNORED_DIRECTORIES = {
	'.git',
	'.hg',
	'.svn',
	'__pycache__',
	'node_modules',
	'.venv',
	'venv',
	'env',
	'dist',
	'build',
	'.idea',
	'.next',
	'coverage',
}

BINARY_EXTENSIONS = {
	'.7z',
	'.avi',
	'.bmp',
	'.class',
	'.db',
	'.dll',
	'.dmg',
	'.doc',
	'.docx',
	'.eot',
	'.exe',
	'.gif',
	'.ico',
	'.iso',
	'.jar',
	'.jpeg',
	'.jpg',
	'.mov',
	'.mp3',
	'.mp4',
	'.ogg',
	'.otf',
	'.pdf',
	'.png',
	'.pyc',
	'.rar',
	'.so',
	'.tar',
	'.tiff',
	'.ttf',
	'.wav',
	'.webp',
	'.woff',
	'.woff2',
	'.xls',
	'.xlsx',
	'.zip',
}

FRAMEWORK_FILES = {
	'Django': {'manage.py', 'settings.py', 'urls.py'},
	'Flask': {'app.py'},
	'FastAPI': {'main.py'},
	'Next.js': {'next.config.js', 'next.config.mjs', 'next.config.ts'},
	'React': {'package.json'},
	'Angular': {'angular.json'},
	'Vue': {'vue.config.js', 'vite.config.js'},
	'Spring Boot': {'pom.xml'},
	'Android': {'AndroidManifest.xml'},
	'Node.js': {'package.json'},
}


def home(request):
	return render(request, 'analyser/home.html')


def upload(request):
	if request.method != 'POST':
		return render(request, 'analyser/upload.html')
	
	repository = request.FILES.get('repository')
	
	if not repository:
		return render(request, 'analyser/upload.html', {'error': 'Please select a repository ZIP file.'})
	
	if not repository.name.lower().endswith('.zip'):
		return render(request, 'analyser/upload.html', {'error': 'Only ZIP repository archives are supported.'})
	
	if repository.size > 100 * 1024 * 1024:
		return render(request, 'analyser/upload.html', {'error': 'The repository archive must not exceed 100 MB.'})
	
	try:
		with zipfile.ZipFile(repository) as archive:
			members = archive.infolist()
			
			if len(members) > 20000:
				return render(request, 'analyser/upload.html', {'error': 'The repository contains too many files.'})
			
			total_uncompressed_size = sum(member.file_size for member in members)
			
			if total_uncompressed_size > 500 * 1024 * 1024:
				return render(request, 'analyser/upload.html', {'error': 'The extracted repository must not exceed 500 MB.'})
			
			with tempfile.TemporaryDirectory(prefix='reposight_') as temporary_directory:
				extraction_root = Path(temporary_directory).resolve()
				
				for member in members:
					member_path = Path(member.filename.replace('\\', '/'))
					target_path = (extraction_root / member_path).resolve()
					
					if extraction_root != target_path and extraction_root not in target_path.parents:
						return render(request, 'analyser/upload.html', {'error': 'The repository contains an unsafe archive path.'})
					
					if member.is_dir():
						target_path.mkdir(parents=True, exist_ok=True)
						continue
					
					target_path.parent.mkdir(parents=True, exist_ok=True)
					
					with archive.open(member) as source, target_path.open('wb') as target:
						shutil.copyfileobj(source, target)
				
				repository_files = []
				language_stats = {}
				extension_stats = {}
				largest_files = []
				maximum_depth = 0
				total_repository_size = 0
				total_lines = 0
				total_code_lines = 0
				total_blank_lines = 0
				total_comment_lines = 0
				python_classes = 0
				python_functions = 0
				python_imports = set()
				frameworks = set()
				dependencies = set()
				
				for path in extraction_root.rglob('*'):
					relative_path = path.relative_to(extraction_root)
					
					if any(part in IGNORED_DIRECTORIES for part in relative_path.parts):
						continue
					
					maximum_depth = max(maximum_depth, len(relative_path.parts))
					
					if not path.is_file():
						continue
					
					file_size = path.stat().st_size
					total_repository_size += file_size
					
					extension = path.suffix.lower()
					extension_stats[extension or '[no extension]'] = extension_stats.get(extension or '[no extension]', 0) + 1
					
					language = LANGUAGE_EXTENSIONS.get(extension)
					
					file_record = {
						'path': str(relative_path).replace('\\', '/'),
						'size': file_size,
						'language': language or 'Other',
					}
					
					repository_files.append(file_record)
					
					if language is None or extension in BINARY_EXTENSIONS or file_size > 5 * 1024 * 1024:
						continue
					
					try:
						source = path.read_text(encoding='utf-8')
					except (UnicodeDecodeError, OSError):
						continue
					
					lines = source.splitlines()
					line_count = len(lines)
					blank_count = sum(1 for line in lines if not line.strip())
					comment_count = 0
					code_count = 0
					in_block_comment = False
					
					for line in lines:
						stripped = line.strip()
						
						if not stripped:
							continue
						
						if language == 'Python':
							if stripped.startswith('#'):
								comment_count += 1
							else:
								code_count += 1
						elif language in {'Java', 'Kotlin', 'JavaScript', 'TypeScript', 'C', 'C++', 'C#', 'Go', 'Rust', 'PHP', 'Swift', 'Dart', 'Scala'}:
							if in_block_comment:
								comment_count += 1
								if '*/' in stripped:
									in_block_comment = False
								continue
							
							if stripped.startswith('/*'):
								comment_count += 1
								if '*/' not in stripped[2:]:
									in_block_comment = True
								continue
							
							if stripped.startswith('//'):
								comment_count += 1
							else:
								code_count += 1
						elif language in {'Ruby', 'Shell', 'PowerShell', 'R'}:
							if stripped.startswith('#'):
								comment_count += 1
							else:
								code_count += 1
						else:
							code_count += 1
					
					language_entry = language_stats.setdefault(language, {
						'files': 0,
						'lines': 0,
						'code': 0,
						'blank': 0,
						'comments': 0,
						'bytes': 0,
					})
					
					language_entry['files'] += 1
					language_entry['lines'] += line_count
					language_entry['code'] += code_count
					language_entry['blank'] += blank_count
					language_entry['comments'] += comment_count
					language_entry['bytes'] += file_size
					
					total_lines += line_count
					total_code_lines += code_count
					total_blank_lines += blank_count
					total_comment_lines += comment_count
					
					if language == 'Python':
						try:
							tree = ast.parse(source)
							python_classes += sum(1 for node in ast.walk(tree) if isinstance(node, ast.ClassDef))
							python_functions += sum(1 for node in ast.walk(tree) if isinstance(node, (ast.FunctionDef, ast.AsyncFunctionDef)))
							
							for node in ast.walk(tree):
								if isinstance(node, ast.Import):
									python_imports.update(alias.name.split('.')[0] for alias in node.names)
								elif isinstance(node, ast.ImportFrom) and node.module:
									python_imports.add(node.module.split('.')[0])
						except SyntaxError:
							pass
					
					if path.name in {'package.json', 'requirements.txt', 'pyproject.toml', 'Pipfile', 'pom.xml', 'build.gradle', 'build.gradle.kts', 'Cargo.toml', 'go.mod'}:
						try:
							content = source
							
							if path.name == 'package.json':
								package_data = json.loads(content)
								dependencies.update(package_data.get('dependencies', {}).keys())
								dependencies.update(package_data.get('devDependencies', {}).keys())
							elif path.name == 'requirements.txt':
								dependencies.update(
									re.split(r'[<>=!~]', line.strip())[0]
									for line in content.splitlines()
									if line.strip() and not line.strip().startswith('#')
								)
							elif path.name == 'pyproject.toml':
								for match in re.findall(r'["\']([A-Za-z0-9_.-]+)(?:[<>=!~]|["\'])', content):
									dependencies.add(match)
							elif path.name == 'Cargo.toml':
								dependency_section = re.search(r'\[dependencies\](.*?)(?:\n\[|\Z)', content, re.DOTALL)
								if dependency_section:
									dependencies.update(
										line.split('=')[0].strip()
										for line in dependency_section.group(1).splitlines()
										if '=' in line and line.strip() and not line.lstrip().startswith('#')
									)
							elif path.name == 'go.mod':
								dependencies.update(
									match
									for match in re.findall(r'^\s*([A-Za-z0-9._/-]+)\s+v[\d.]+', content, re.MULTILINE)
								)
						except (json.JSONDecodeError, OSError):
							pass
					
					for framework, filenames in FRAMEWORK_FILES.items():
						if path.name in filenames:
							if framework == 'Django' and path.name == 'settings.py':
								frameworks.add('Django')
							elif framework != 'Django':
								frameworks.add(framework)
				
				if any(path.name == 'manage.py' for path in extraction_root.rglob('manage.py')):
					frameworks.add('Django')
				
				if any(path.name in {'next.config.js', 'next.config.mjs', 'next.config.ts'} for path in extraction_root.rglob('*')):
					frameworks.add('Next.js')
				
				if any(path.name == 'angular.json' for path in extraction_root.rglob('angular.json')):
					frameworks.add('Angular')
				
				if any(path.name in {'vue.config.js', 'vite.config.js'} for path in extraction_root.rglob('*')):
					frameworks.add('Vue')
				
				language_data = sorted(
					[
						{
							'language': language,
							**stats,
						}
						for language, stats in language_stats.items()
					],
					key=lambda item: item['lines'],
					reverse=True,
				)
				
				largest_files = sorted(
					repository_files,
					key=lambda item: item['size'],
					reverse=True
				)[:15]
				
				extension_data = sorted(
					[
						{'extension': extension, 'files': count}
						for extension, count in extension_stats.items()
					],
					key=lambda item: item['files'],
					reverse=True
				)[:20]
				
				total_files = len(repository_files)
				total_directories = sum(
					1
					for path in extraction_root.rglob('*')
					if path.is_dir()
					and not any(part in IGNORED_DIRECTORIES for part in path.relative_to(extraction_root).parts)
				)
				
				git_directory = extraction_root / '.git'
				git_present = git_directory.is_dir()
				
				git_data = {
					'present': git_present,
					'branches': 0,
					'commits': 0,
				}
				
				if git_present:
					head_file = git_directory / 'HEAD'
					refs_root = git_directory / 'refs'
					
					if head_file.exists():
						try:
							head = head_file.read_text(encoding='utf-8').strip()
							git_data['head'] = head.replace('ref: refs/heads/', '')
						except OSError:
							git_data['head'] = 'Unknown'
					
					if refs_root.exists():
						git_data['branches'] = sum(1 for path in refs_root.rglob('*') if path.is_file())
					
					objects_root = git_directory / 'objects'
					if objects_root.exists():
						git_data['objects'] = sum(
							1
							for path in objects_root.rglob('*')
							if path.is_file() and len(path.name) == 38
						)
				
				result = {
					'repository_name': Path(repository.name).stem,
					'archive_size': repository.size,
					'total_repository_size': total_repository_size,
					'total_files': total_files,
					'total_directories': total_directories,
					'maximum_depth': maximum_depth,
					'total_lines': total_lines,
					'total_code_lines': total_code_lines,
					'total_blank_lines': total_blank_lines,
					'total_comment_lines': total_comment_lines,
					'language_data': language_data,
					'extension_data': extension_data,
					'largest_files': largest_files,
					'frameworks': sorted(frameworks),
					'dependencies': sorted(dependencies)[:100],
					'python_classes': python_classes,
					'python_functions': python_functions,
					'python_imports': sorted(python_imports)[:100],
					'git_data': git_data,
				}
				
				return render(request, 'analyser/result.html', result)
	
	except zipfile.BadZipFile:
		return render(request, 'analyser/upload.html', {'error': 'The uploaded file is not a valid ZIP archive.'})
	except (OSError, ValueError):
		return render(request, 'analyser/upload.html', {'error': 'The repository could not be processed.'})
	
	return render(request, 'analyser/upload.html')
