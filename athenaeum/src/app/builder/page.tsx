"use client";

import { Branding } from "@/app/(public)/layout";
import type { AssetKey, AthBuilderMeta, AthContent, AthDownload, DownloadType, EntryMode } from "@/app/AthenaeumMaster";
import { APP_NAME, ASSET_MAP, DL_TYPES, ENTRY_MODES, EXTS, MAX_FILE_BYTES, MAX_FILE_MB } from "@/app/AthenaeumMaster";
import { CrsKey, getCourseSubs, SubKey } from "@/app/BgcMaster";
import { useWipView } from "@/components/mui/apx/tsx/WiPView";
import { bridgeOnboardingBuilderMetaGET } from "@/firebase/Bridge";
import { useFirebaseAccountModifiers, useFirebaseUid } from "@/firebase/FirebaseApp";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import GoogleIcon from "@mui/icons-material/Google";
import { Box, Button, Chip, IconButton, Paper, Stack, TextField, ToggleButton, ToggleButtonGroup, Typography } from "@mui/material";
import "@uiw/react-markdown-preview/markdown.css";
import MDEditor from "@uiw/react-md-editor";
import "@uiw/react-md-editor/markdown-editor.css";
import React from "react";




const HINT = "Generate structured educational Markdown content. Follow these rules strictly:\n" +
		  "\n" +
		  "- Use proper Markdown headings, paragraphs, bold, italics, lists and tables.\n" +
		  "- Inline mathematics: use `\\( ... \\)` exclusively.\n" +
		  "- Display mathematics: use `\\[ ... \\]` exclusively, with delimiters on separate lines.\n" +
		  "- Never use `$` or `$$` as mathematical delimiters.\n" +
		  "- Preserve all LaTeX backslashes, braces, subscripts and superscripts.\n" +
		  "- Inline code: use single backticks, e.g. `int count = 10;`.\n" +
		  "- Block code: use triple backticks with the correct language identifier, e.g. ` ```java `, ` ```javascript ` or ` ```python `.\n" +
		  "- Never represent code as plain text or use inline code for multi-line code.\n" +
		  "- Ensure code is complete, syntactically correct and properly indented.\n" +
		  "\n" +
		  "Examples:\n" +
		  "\n" +
		  "Inline mathematics: \\\\(A\\_{m \\times n}\\\\)\n" +
		  "\n" +
		  "Display mathematics:\n" +
		  "\n" +
		  "\\\\[ A = \\begin{bmatrix} 1 & 2 \\\\\\ 3 & 4 \\end{bmatrix} \\\\]\n" +
		  "\n" +
		  "Inline code: `System.out.println(\"Hello\");`\n" +
		  "\n" +
		  "Block code:\n" +
		  "\n" +
		  "```\n" +
		  "public class Main {\n" +
		  "    public static void main(String[] args) {\n" +
		  "        System.out.println(\"Hello\");\n" +
		  "    }\n" +
		  "}\n" +
		  "```\n" +
		  "\n" +
		  "Return ONLY the generated Markdown content. Do not include introductory commentary, explanations or closing remarks.";


/* Helper for URL validation */
const validateUrl = (rawUrl: string) => {
	  try {
			 const parsed = new URL(rawUrl.trim());
			 return (parsed.protocol === "https:" || parsed.protocol === "http:") && /*TRUTHY->*/ !! parsed.hostname;
	  } catch {
			 return false;
	  }
};

const isValidFile = (file: File) => {
	  const name = file.name.toLowerCase();
	  return EXTS.some((ext) => name.endsWith(ext));
};

const handleFilesValidate = (files: FileList | File[], onValidated: (files: File[]) => void) => {
	  if ( /*TRUTHY->*/ !! files) {
			 files = Array.from(files);
			 const validFiles = files.filter(file => file.size <= MAX_FILE_BYTES).filter(isValidFile);
			 const rejectedFiles = files.filter(file =>  /*NOT->*/ ! validFiles.includes(file));
			 if (rejectedFiles.length) {
					alert(`Maximum file size is ${ MAX_FILE_MB } MB. Rejected: ${ rejectedFiles.map(file => file.name).join(", ") }`);
			 }
			 if (validFiles.length > 0) {
					onValidated(validFiles);
			 }
	  }
};


function AdminFormContainer({
											meta,
											onContentSubmitted, onDownloadSubmitted
									 }: {
											meta: AthBuilderMeta,
											onContentSubmitted: (value: AthContent) => void; onDownloadSubmitted: (value: AthDownload[]) => void;
									 }
) {
	  const { crs } = meta;
	  const [ mode, setMode ] = React.useState<EntryMode>("content");
	  const [ subKey, setSubKey ] = React.useState<SubKey>("");
	  const [ matKey, setMatKey ] = React.useState<AssetKey>("");
	  
	  const { setUi, close, open, WiPView } = useWipView();
	  
	  /* Content Form State */
	  const [ tagsInput, setTagsInput ] = React.useState("");
	  const [ contentTitle, setContentTitle ] = React.useState("");
	  const [ content, setContent ] = React.useState("");
	  
	  /* Download Form State */
	  const [ dlType, setDlType ] = React.useState<DownloadType>("file");
	  const [ selectedFiles, setSelectedFiles ] = React.useState<File[]>([]);
	  const [ urlPairs, setUrlPairs ] = React.useState<Array<{ title: string; url: string }>>([ { title: "", url: "" } ]);
	  
	  /* Derived State for Content */
	  const tags = tagsInput.split(",").map((tag) => tag.trim()).filter(Boolean);
	  const validTags = tagsInput.trim().length > 0 && tags.every(Boolean) && new Set(tags).size === tags.length;
	  const isContentValid =   /*TRUTHY->*/ !! (subKey && matKey && contentTitle.trim() && content.trim() && validTags);
	  
	  
	  const isDownloadValid = dlType === "file"
				 ? /*TRUTHY->*/ !! (subKey && selectedFiles.length > 0 && selectedFiles.every(isValidFile))
				 : /*TRUTHY->*/ !! (subKey && urlPairs.length > 0 && urlPairs.every((p) => p.title.trim() && validateUrl(p.url)));
	  
	  
	  const upload = (files: File[]) => {
			 setSelectedFiles((prev) => Array.from(new Set([ ...prev, ...files ])));
			 /* TODO: Upload files in background to storage and update URLs accordingly */
	  };
	  
	  const handleReset = () => {
			 setSubKey("");
			 setMatKey("");
			 setTagsInput("");
			 setContentTitle("");
			 setContent("");
			 setSelectedFiles([]);
			 setUrlPairs([ { title: "", url: "" } ]);
	  };
	  
	  const handleSubmit = () => {
			 if (/*NOT->*/ ! subKey || /*NOT->*/ ! matKey) return;
			 if (mode === "content") {
					if (/*NOT->*/ ! isContentValid) return;
					onContentSubmitted({ sub: subKey, ast: matKey, tags, title: contentTitle.trim(), content });
			 }
			 if (mode === "download") {
					if (/*NOT->*/ ! isDownloadValid) return;
					// Submitting download entries accordingly
					const downloads: AthDownload[] = [];
					switch (dlType) {
						  case "file":
								 selectedFiles.forEach((file) => downloads.push({ sub: subKey, ast: matKey, title: file.name, url: URL.createObjectURL(file) }));
								 break;
						  case "url":
								 urlPairs.forEach((pair) => downloads.push({ sub: subKey, ast: matKey, title: pair.title.trim(), url: pair.url.trim() }));
								 break;
					}
					downloads.length > 0 && onDownloadSubmitted(downloads);
			 }
	  };
	  
	  return (
				 <>
						<WiPView/>
						<Stack spacing={ 3 }>
							  {/* Mode Selector */ }
							  <Box sx={ { display: "flex", justifyContent: "center" } }>
									 <ToggleButtonGroup
												value={ mode }
												exclusive
												onChange={ (_, newMode: EntryMode | null) => {
													  /*TRUTHY->*/
													  !! newMode && setMode(newMode);
												} }
												color={ "primary" }
									 >
											{ ENTRY_MODES.map((m) => (
													  <ToggleButton key={ m } value={ m } sx={ { px: 4, textTransform: "capitalize" } }>
															 { m }
													  </ToggleButton>
											)) }
									 </ToggleButtonGroup>
							  </Box>
							  
							  {/* Common Subject and Asset Selection */ }
							  <Box>
									 <Typography variant={ "body2" } color={ "text.secondary" } sx={ { mb: 1 } }>{ "Subject *" }</Typography>
									 <Stack direction={ "row" } spacing={ 1 } useFlexGap flexWrap={ "wrap" }>
											{ getCourseSubs(crs).map(([ key, value ]) => (
													  <Chip
																 key={ key }
																 label={ value }
																 clickable
																 color={ subKey === key ? "primary" : "default" }
																 variant={ subKey === key ? "filled" : "outlined" }
																 onClick={ () => setSubKey(subKey === key ? "" : key as SubKey) }
													  />
											)) }
									 </Stack>
							  </Box>
							  <Box>
									 <Typography variant={ "body2" } color={ "text.secondary" } sx={ { mb: 1 } }>{ "Asset *" }</Typography>
									 <Stack direction={ "row" } spacing={ 1 } useFlexGap flexWrap={ "wrap" }>
											{ Object.entries(ASSET_MAP).map(([ key, value ]) => (
													  <Chip
																 key={ key }
																 label={ value }
																 clickable
																 color={ matKey === key ? "primary" : "default" }
																 variant={ matKey === key ? "filled" : "outlined" }
																 onClick={ () => setMatKey(matKey === key ? "" : key as AssetKey) }
													  />
											)) }
									 </Stack>
							  </Box>
							  
							  {/* Mode-Specific Forms */ }
							  { mode === "content" && (
										 <Stack spacing={ 2.5 }>
												<Typography variant={ "body2" } color={ "text.secondary" } sx={ { mb: 1 } }>{ "Title *" }</Typography>
												<TextField
														  value={ contentTitle }
														  onChange={ (event) => setContentTitle(event.target.value) }
														  required fullWidth
												/>
												<Typography variant={ "body2" } color={ "text.secondary" } sx={ { mb: 1 } }>{ "Tags *" }</Typography>
												<TextField
														  value={ tagsInput }
														  onChange={ (event) => setTagsInput(event.target.value) }
														  required fullWidth
												/>
												<Stack spacing={ 1 }>
													  <Typography variant={ "body2" } color={ "text.secondary" }>{ "Content *" }</Typography>
													  <MDEditor
																 value={ content || HINT }
																 onChange={ (val) => setContent(val ?? "") }
																 height={ 480 }
																 preview={ "edit" }
													  />
												</Stack>
										 </Stack>
							  ) }
							  
							  { mode === "download" && (
										 <Stack spacing={ 2.5 }>
												<Box sx={ { display: "flex", justifyContent: "center", mb: 1 } }>
													  <ToggleButtonGroup
																 value={ dlType }
																 exclusive
																 onChange={ (_, newType: DownloadType | null) => (/*TRUTHY->*/ !! newType) && setDlType(newType) }
																 size={ "small" }
																 color={ "primary" }
													  >
															 { DL_TYPES.map((dt) => (
																		<ToggleButton key={ dt } value={ dt } sx={ { px: 3, textTransform: "capitalize" } }>
																			  { dt === "file" ? "File Upload" : "Direct URL" }
																		</ToggleButton>
															 )) }
													  </ToggleButtonGroup>
												</Box>
												
												{ dlType === "file" && (
														  <Stack spacing={ 2 }>
																 <Box
																			onDragOver={ (event) => event.preventDefault() }
																			onDrop={ event => {
																				  event.preventDefault();
																				  handleFilesValidate(event.dataTransfer.files, upload);
																			} }
																			sx={ {
																				  border: "2px dashed",
																				  borderColor: "divider",
																				  borderRadius: 2,
																				  p: 4,
																				  textAlign: "center",
																				  cursor: "pointer",
																				  bgcolor: "action.hover",
																				  "&:hover": { borderColor: "primary.main" }
																			} }
																			onClick={ () => document.getElementById("file-drop-input")?.click() }
																 >
																		<input
																				  id={ "file-drop-input" }
																				  type={ "file" }
																				  multiple
																				  accept={ EXTS.join(",") }
																				  style={ { display: "none" } }
																				  onChange={ event => handleFilesValidate(event.target.files, upload) }
																		/>
																		<Typography variant={ "body1" } color={ "text.secondary" }>
																			  { "Drag & drop files here, or click to select (Images, PDF, Office, MD)" }
																		</Typography>
																 </Box>
																 { selectedFiles.length > 0 && (
																			<Stack spacing={ 1 }>
																				  <Typography variant={ "body2" } color={ "text.secondary" }>{ "Selected Files (Titles):" }</Typography>
																				  { selectedFiles.map((file, idx) => (
																							 <Paper key={ idx } variant={ "outlined" } sx={ { p: 1.5, display: "flex", justifyContent: "space-between", alignItems: "center" } }>
																									<Typography variant={ "body2" }>{ file.name }</Typography>
																									<IconButton size={ "small" } color={ "error" } onClick={ () => setSelectedFiles((prev) => prev.filter((_, i) => i !== idx)) }>
																										  <DeleteIcon fontSize={ "small" }/>
																									</IconButton>
																							 </Paper>
																				  )) }
																			</Stack>
																 ) }
														  </Stack>
												) }
												
												{ dlType === "url" && (
														  <Stack spacing={ 3 }>
																 { urlPairs.map((pair, index) => (
																			<Stack key={ index } direction={ "row" } spacing={ 1.5 }>
																				  <Stack flex={ 1 } spacing={ 1.5 }>
																						 <TextField
																									label={ "Title" }
																									value={ pair.title }
																									onChange={ (e) => {
																										  const val = e.target.value;
																										  setUrlPairs((prev) => prev.map((p, i) => i === index ? { ...p, title: val } : p));
																									} }
																									required fullWidth
																						 />
																						 <TextField
																									label={ "URL" }
																									value={ pair.url }
																									onChange={ (e) => {
																										  const val = e.target.value;
																										  setUrlPairs((prev) => prev.map((p, i) => i === index ? { ...p, url: val } : p));
																									} }
																									error={ /*TRUTHY->*/ !! (pair.url.trim() && /*NOT->*/ ! validateUrl(pair.url)) }
																									required fullWidth
																						 />
																				  </Stack>
																				  { urlPairs.length > 1 && (
																							 <Box>
																									<IconButton color={ "error" } onClick={ () => setUrlPairs((prev) => prev.filter((_, i) => i !== index)) }>
																										  <DeleteIcon/>
																									</IconButton>
																							 </Box>
																				  ) }
																			</Stack>
																 )) }
																 <Button
																			variant={ "outlined" }
																			startIcon={ <AddIcon/> }
																			onClick={ () => setUrlPairs((prev) => [ ...prev, { title: "", url: "" } ]) }
																			sx={ { alignSelf: "center" } }
																 >
																		{ "Add Another" }
																 </Button>
														  </Stack>
												) }
										 </Stack>
							  ) }
							  
							  {/* Action Buttons */ }
							  <Stack direction={ "row" } spacing={ 1 }>
									 <Button variant={ "outlined" } fullWidth onClick={ handleReset }>{ "Cancel" }</Button>
									 <Button
												variant={ "contained" }
												disabled={ (mode === "content" && /*NOT->*/ ! isContentValid) || (mode === "download" && /*NOT->*/ ! isDownloadValid) }
												fullWidth
												onClick={ handleSubmit }
									 >
											{ "Submit" }
									 </Button>
							  </Stack>
						</Stack>
				 </>
	  );
}

export default function BuilderPage() {
	  const uid = useFirebaseUid();
	  const { signInWithGoogle, signOut } = useFirebaseAccountModifiers();
	  const [ builderMeta, setBuilderMeta ] = React.useState<AthBuilderMeta>(undefined);
	  
	  React.useEffect(() => {
			 if (uid) {
					bridgeOnboardingBuilderMetaGET().then(
							  value => {
									 const { status, message, ...meta } = value.data;
									 if (status === "SUCCESS") {
											setBuilderMeta(meta);
									 }
							  }
					);
			 }
	  }, [ uid ]);
	  
	  if ( /*NOT->*/ ! uid) return (
				 <Stack spacing={ 1 } sx={ { height: "100vh", mx: "auto", p: { xs: 2, md: 4 } } } maxWidth={ 360 } justifyContent={ "center" }>
						<Button variant={ "contained" } fullWidth onClick={ () => signInWithGoogle() } startIcon={ <GoogleIcon/> }>{ "Sign-In with Google" }</Button>
				 </Stack>
	  );
	  
	  if (uid && builderMeta) return (
				 <Stack spacing={ 3 } sx={ { mx: "auto", p: { xs: 2, sm: 3 } } }>
						<Stack direction={ { xs: "column", sm: "row" } } spacing={ 2 } alignSelf={ "center" } alignItems={ "center" }>
							  <Branding showAppName={ false }/>
							  <Stack alignItems={ { xs: "center", sm: "flex-start" } }>
									 <Typography variant={ "h4" } color={ "primary" }>{ APP_NAME + " Builder" }</Typography>
									 <Typography variant={ "body1" } color={ "text.secondary" }>{ builderMeta.email }</Typography>
									 <Typography variant={ "body1" } color={ "text.secondary" }>{ builderMeta.bgcId }</Typography>
							  </Stack>
						</Stack>
						<Paper variant={ "outlined" } sx={ { p: { xs: 2, md: 3 } } }>
							  <AdminFormContainer
										 meta={ builderMeta }
										 onContentSubmitted={ (val) => console.log("Content:", val) }
										 onDownloadSubmitted={ (val) => console.log("Download:", val) }
							  />
						</Paper>
						<Stack alignSelf={ "center" }>
							  <Button variant={ "text" } sx={ { fontSize: 12, color: "text.secondary" } } onClick={ () => signOut() }>{ "Sign-Out" }</Button>
						</Stack>
				 </Stack>
	  );
}
