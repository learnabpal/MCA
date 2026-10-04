import io

import pandas as pd
from django.shortcuts import render

from .ml import analyse_text


def home(request):
	return render(request, 'analyser/home.html')


def analyse(request):
	if request.method != 'POST':
		return render(request, 'analyser/home.html')
	
	text = request.POST.get('text', '').strip()
	
	if not text:
		return render(
			request,
			'analyser/home.html',
			{'error': 'Enter some text to analyse.'},
		)
	
	if len(text) > 10000:
		return render(
			request,
			'analyser/home.html',
			{'error': 'Text is limited to 10,000 characters.'},
		)
	
	result = analyse_text(text)
	
	return render(
		request,
		'analyser/result.html',
		{'result': result},
	)


def batch(request):
	if request.method != 'POST':
		return render(request, 'analyser/batch.html')
	
	uploaded_file = request.FILES.get('file')
	
	if uploaded_file is None:
		return render(
			request,
			'analyser/batch.html',
			{'error': 'Select a CSV file.'},
		)
	
	if not uploaded_file.name.lower().endswith('.csv'):
		return render(
			request,
			'analyser/batch.html',
			{'error': 'Only CSV files are supported.'},
		)
	
	try:
		dataframe = pd.read_csv(io.BytesIO(uploaded_file.read()))
		
		text_column = request.POST.get('column', '').strip()
		
		if text_column:
			if text_column not in dataframe.columns:
				return render(
					request,
					'analyser/batch.html',
					{
						'error': f'Column "{text_column}" was not found.',
						'columns': dataframe.columns.tolist(),
					},
				)
		else:
			text_columns = [
				column
				for column in dataframe.columns
				if dataframe[column].dtype == 'object'
			]
			
			if not text_columns:
				return render(
					request,
					'analyser/batch.html',
					{'error': 'No text column was found in the CSV.'},
				)
			
			text_column = text_columns[0]
		
		dataframe = dataframe[[text_column]].dropna().head(100)
		
		results = []
		
		for text in dataframe[text_column].astype(str):
			result = analyse_text(text)
			
			results.append({
				'text': text,
				'model_label': result['model_label'],
				'model_score': result['model_score'],
				'vader_label': result['vader_label'],
				'agreement': result['agreement'],
			})
		
		positive_count = sum(
			1 for result in results
			if result['model_label'] == 'POSITIVE'
		)
		
		negative_count = sum(
			1 for result in results
			if result['model_label'] == 'NEGATIVE'
		)
		
		agreement_count = sum(
			1 for result in results
			if result['agreement']
		)
		
		return render(
			request,
			'analyser/batch.html',
			{
				'results': results,
				'columns': dataframe.columns.tolist(),
				'selected_column': text_column,
				'row_count': len(results),
				'positive_count': positive_count,
				'negative_count': negative_count,
				'agreement_count': agreement_count,
			},
		)
	
	except Exception as error:
		return render(
			request,
			'analyser/batch.html',
			{'error': str(error)},
		)
