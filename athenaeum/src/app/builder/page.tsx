"use client";

import { Branding } from "@/app/(public)/layout";
import type { AssetKey, AssetType, AthAsset, AthBuilderMeta, DownloadType } from "@/app/AthenaeumMaster";
import { APP_NAME, ASSET_MAP, ASSET_TYPES, DL_TYPES, EXTS, MAX_FILE_BYTES, MAX_FILE_MB } from "@/app/AthenaeumMaster";
import { getCourseSubs, SubKey } from "@/app/BgcMaster";
import { useWipView } from "@/components/mui/apx/tsx/WiPView";
import { bridgeOnboardingBuilderMetaGET, bridgePushAsset, bridgeUploadFiles } from "@/firebase/Bridge";
import { useFirebaseAccountModifiers, useFirebaseUid } from "@/firebase/FirebaseApp";
import AddIcon from "@mui/icons-material/Add";
import ContentCopyOutlined from "@mui/icons-material/ContentCopyOutlined";
import DeleteIcon from "@mui/icons-material/Delete";
import GoogleIcon from "@mui/icons-material/Google";
import { Box, Button, Chip, IconButton, Paper, Stack, TextField, ToggleButton, ToggleButtonGroup, Typography } from "@mui/material";
import "@uiw/react-markdown-preview/markdown.css";
import MDEditor from "@uiw/react-md-editor";
import "@uiw/react-md-editor/markdown-editor.css";
import React from "react";




const GEN_AI_PROMPT = "Generate structured educational Markdown content. Follow these rules strictly:\n" +
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


function BuilderForms({ meta }: { meta: AthBuilderMeta, }) {
	  const { crs } = meta;
	  const [ assetType, setAssetType ] = React.useState<AssetType>("content");
	  const [ subKey, setSubKey ] = React.useState<SubKey>("");
	  const [ astKey, setAstKey ] = React.useState<AssetKey>("");
	  
	  const { setUi, close, open, WiPView } = useWipView();
	  
	  /* Content Form State */
	  const [ contentTitle, setContentTitle ] = React.useState("");
	  const [ content, setContent ] = React.useState("");
	  
	  /* Download Form State */
	  const [ dlType, setDlType ] = React.useState<DownloadType>("file");
	  const [ selectedFiles, setSelectedFiles ] = React.useState<File[]>([]);
	  const [ urlPairs, setUrlPairs ] = React.useState<Array<{ title: string; url: string }>>([ { title: "", url: "" } ]);
	  
	  const isContentValid = subKey && astKey && contentTitle.trim() && content.trim();
	  
	  const isDownloadValid = subKey && astKey && (
				 // dlType === "file"
				 // 		? (selectedFiles.length > 0 && selectedFiles.every(isValidFile))
				 // 		:
				 (urlPairs.length > 0 && urlPairs.every((p) => p.title.trim() && validateUrl(p.url)))
				 && (dlType !== "file" || selectedFiles.length === 0)
	  );
	  
	  
	  const updateSelectedFiles = (files: File[]) => {
			 setSelectedFiles(prevState => Array.from(new Set([ ...prevState, ...files ])));
	  };
	  
	  const handleReset = () => {
			 setSubKey("");
			 setAstKey("");
			 setContentTitle("");
			 setContent("");
			 setSelectedFiles([]);
			 setUrlPairs([ { title: "", url: "" } ]);
			 close();
	  };
	  
	  const noKey = (/*NOT->*/ ! subKey || /*NOT->*/ ! astKey);
	  const invalidUploadables = selectedFiles.length < 1 || noKey ||  /*NOT->*/ ! selectedFiles.every(isValidFile);
	  
	  const handleUpload = () => {
			 if (invalidUploadables) return;
			 open();
			 setUi("Uploading files...", false);
			 bridgeUploadFiles(selectedFiles).then(
						value => {
							  const { results, status } = value.data;
							  if (status === "SUCCESS" && results?.length) {
									 setUrlPairs(prevState => [ ...prevState, ...results ]);
									 setSelectedFiles([]);
									 setUi("Files uploaded successfully");
							  } else {
									 setUi("File upload failed");
							  }
						},
						error => {
							  setUi(error?.message || "File upload failed");
						}
			 );
	  };
	  
	  const handleSubmit = () => {
			 if (noKey) return;
			 switch (assetType) {
					case "content":
						  if (/*NOT->*/ ! isContentValid) return;
						  open();
						  setUi("Submitting...", false);
						  bridgePushAsset(assetType, [ { sub: subKey, ast: astKey, title: contentTitle.trim(), src: content } ]).then(
									 value => handleReset(),
									 error => setUi(error?.message || "Submission failed")
						  );
						  break;
					case "download":
						  if (/*NOT->*/ ! isDownloadValid) return;
						  const assets: AthAsset[] = [];
						  urlPairs.forEach(({ title, url }) => assets.push({ sub: subKey, ast: astKey, title: title.trim(), src: url.trim() }));
						  open();
						  setUi("Submitting...", false);
						  bridgePushAsset(assetType, assets).then(
									 value => handleReset(),
									 error => setUi(error?.message || "Submission failed")
						  );
						  break;
			 }
	  };
	  
	  
	  return (
				 <>
						<WiPView/>
						<Stack spacing={ 3 }>
							  {/* Mode Selector */ }
							  <Box sx={ { display: "flex", justifyContent: "center" } }>
									 <ToggleButtonGroup
												value={ assetType }
												exclusive
												onChange={ (_, newMode: AssetType | null) => ( /*TRUTHY->*/ !! newMode) && setAssetType(newMode) }
												color={ "primary" }
									 >
											{ ASSET_TYPES.map((m) => (
													  <ToggleButton key={ m } value={ m } sx={ { px: 4, textTransform: "capitalize" } }>{ m }</ToggleButton>
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
																 color={ astKey === key ? "primary" : "default" }
																 variant={ astKey === key ? "filled" : "outlined" }
																 onClick={ () => setAstKey(astKey === key ? "" : key as AssetKey) }
													  />
											)) }
									 </Stack>
							  </Box>
							  
							  {/* Mode-Specific Forms */ }
							  { assetType === "content" && (
										 <Stack spacing={ 2.5 }>
												<Typography variant={ "body2" } color={ "text.secondary" } sx={ { mb: 1 } }>{ "Title *" }</Typography>
												<TextField
														  value={ contentTitle }
														  onChange={ (event) => setContentTitle(event.target.value) }
														  required fullWidth
												/>
												<Stack spacing={ 1 }>
													  <Typography variant={ "body2" } color={ "text.secondary" }>{ "Content *" }</Typography>
													  <Stack flexDirection={ "row" } alignItems={ "center" } sx={ { border: "1px solid", borderRadius: 2, opacity: 0.5 } } p={ 1 }>
															 <Stack spacing={ 1 }>
																	<Typography variant={ "body2" }>{ "Copy the following prompt to generate structured educational Markdown content." }</Typography>
																	<Typography fontSize={ 10 }>{ GEN_AI_PROMPT.substring(0, 360) + "..." }</Typography>
															 </Stack>
															 <IconButton onClick={ () => window.navigator.clipboard.writeText(GEN_AI_PROMPT) }>
																	<ContentCopyOutlined/>
															 </IconButton>
													  </Stack>
													  <MDEditor
																 value={ content || GEN_AI_PROMPT }
																 onChange={ (val) => setContent(val ?? "") }
																 height={ 480 }
																 preview={ "edit" }
													  />
												</Stack>
										 </Stack>
							  ) }
							  
							  { assetType === "download" && (
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
																				  handleFilesValidate(event.dataTransfer.files, updateSelectedFiles);
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
																				  onChange={ event => handleFilesValidate(event.target.files, updateSelectedFiles) }
																		/>
																		<Typography variant={ "body1" } color={ "text.secondary" }>
																			  { "Drag & drop files here, or click to select (Images, PDF, Office, MD)" }
																		</Typography>
																 </Box>
																 { selectedFiles.length > 0 && <>
																		<Stack spacing={ 1 }>
																			  <Typography variant={ "body2" } color={ "text.secondary" }>{ "Selected Files:" }</Typography>
																			  { selectedFiles.map((file, idx) => (
																						 <Paper key={ idx } variant={ "outlined" } sx={ { p: 1.5, display: "flex", justifyContent: "space-between", alignItems: "center" } }>
																								<Typography variant={ "body2" }>{ file.name }</Typography>
																								<IconButton size={ "small" } color={ "error" } onClick={ () => setSelectedFiles((prev) => prev.filter((_, i) => i !== idx)) }>
																									  <DeleteIcon fontSize={ "small" }/>
																								</IconButton>
																						 </Paper>
																			  )) }
																			  <Button onClick={ handleUpload } disabled={ invalidUploadables }>{ "Upload Files" }</Button>
																		</Stack>
																 </> }
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
												disabled={ (assetType === "content" && /*NOT->*/ ! isContentValid) || (assetType === "download" && /*NOT->*/ ! isDownloadValid) }
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
							  <BuilderForms
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
