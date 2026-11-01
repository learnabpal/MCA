"use client";

import { Branding } from "@/app/(public)/layout";
import type { AthContent, AthDownload, DownloadType, FormMode, MatKey } from "@/app/AthenaeumMaster";
import { APP_NAME, DL_TYPES, EXTS, FORM_MODES, MAT_MAP, MAX_FILE_BYTES, MAX_FILE_MB, SUB_MAP, type SubKey } from "@/app/AthenaeumMaster";
import { useWipView } from "@/components/mui/apx/tsx/WiPView";
import { bridgeBgcId } from "@/firebase/Bridge";
import { useFirebaseAccountModifiers, useFirebaseUid, useFirebaseUserData } from "@/firebase/FirebaseApp";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import { Box, Button, Chip, IconButton, Paper, Stack, TextField, ToggleButton, ToggleButtonGroup, Typography } from "@mui/material";
import "@uiw/react-markdown-preview/markdown.css";
import MDEditor from "@uiw/react-md-editor";
import "@uiw/react-md-editor/markdown-editor.css";
import React from "react";




function AdminFormContainer({ onContentSubmitted, onDownloadSubmitted }: { onContentSubmitted: (value: AthContent) => void; onDownloadSubmitted: (value: AthDownload[]) => void; }) {
	  const [ mode, setMode ] = React.useState<FormMode>("content");
	  const [ subKey, setSubKey ] = React.useState<SubKey>("");
	  const [ matKey, setMatKey ] = React.useState<MatKey>("");
	  
	  const { setUi, close, open, WiPView } = useWipView();
	  
	  /* Content Form State */
	  const [ tagsInput, setTagsInput ] = React.useState("");
	  const [ contentTitle, setContentTitle ] = React.useState("");
	  const [ content, setContent ] = React.useState("");
	  
	  /* Download Form State */
	  const [ downloadType, setDownloadType ] = React.useState<DownloadType>("file");
	  const [ selectedFiles, setSelectedFiles ] = React.useState<File[]>([]);
	  const [ urlPairs, setUrlPairs ] = React.useState<Array<{ title: string; url: string }>>([ { title: "", url: "" } ]);
	  
	  /* Derived State for Content */
	  const tags = tagsInput.split(",").map((tag) => tag.trim()).filter(Boolean);
	  const validTags = tagsInput.trim().length > 0 && tags.every(Boolean) && new Set(tags).size === tags.length;
	  const isContentValid =   /*TRUTHY->*/ !! (subKey && matKey && contentTitle.trim() && content.trim() && validTags);
	  
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
	  
	  const isDownloadValid = downloadType === "file"
				 ? /*TRUTHY->*/ !! (subKey && selectedFiles.length > 0 && selectedFiles.every(isValidFile))
				 : /*TRUTHY->*/ !! (subKey && urlPairs.length > 0 && urlPairs.every((p) => p.title.trim() && validateUrl(p.url)));
	  
	  
	  const upload = (files: FileList) => {
			 const filesArray = Array.from(files).filter(isValidFile);
			 setSelectedFiles((prev) => Array.from(new Set([ ...prev, ...filesArray ])));
			 /* TODO: Upload files in background to storage and update URLs accordingly */
	  };
	  const handleFilesValidate = (files: File[]) => {
			 const validFiles = files.filter(file => file.size <= MAX_FILE_BYTES);
			 const rejectedFiles = files.filter(file => file.size > MAX_FILE_BYTES);
			 if (rejectedFiles.length) {
					alert(`Maximum file size is ${ MAX_FILE_MB } MB. Rejected: ${ rejectedFiles.map(file => file.name).join(", ") }`);
			 }
			 return validFiles;
	  };
	  const handleFilesDrop = (event: React.DragEvent<HTMLDivElement>) => {
			 event.preventDefault();
			 if (/*TRUTHY->*/ !! event.dataTransfer.files) {
					const files = handleFilesValidate(Array.from(event.dataTransfer.files) || []);
					if (files.length > 0) {
						  upload(event.dataTransfer.files);
					}
			 }
	  };
	  
	  const handleFilesSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
			 if (/*TRUTHY->*/ !! event.target.files) {
					const files = handleFilesValidate(Array.from(event.target.files) || []);
					if (files.length > 0) {
						  upload(event.target.files);
					}
			 }
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
					onContentSubmitted({ sub: subKey, mat: matKey, tags, title: contentTitle.trim(), content });
			 }
			 if (mode === "download") {
					if (/*NOT->*/ ! isDownloadValid) return;
					// Submitting download entries accordingly
					const downloads: AthDownload[] = [];
					if (downloadType === "file") {
						  selectedFiles.forEach((file) => {
								 downloads.push({ sub: subKey, mat: matKey, title: file.name, url: URL.createObjectURL(file) });
						  });
					}
					if (downloadType === "url") {
						  urlPairs.forEach((pair) => {
								 downloads.push({ sub: subKey, mat: matKey, title: pair.title.trim(), url: pair.url.trim() });
						  });
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
												onChange={ (_, newMode: FormMode | null) => {
													  /*TRUTHY->*/
													  !! newMode && setMode(newMode);
												} }
												color={ "primary" }
									 >
											{ FORM_MODES.map((m) => (
													  <ToggleButton key={ m } value={ m } sx={ { px: 4, textTransform: "capitalize" } }>
															 { m }
													  </ToggleButton>
											)) }
									 </ToggleButtonGroup>
							  </Box>
							  
							  {/* Common Subject and Material Selection */ }
							  <Box>
									 <Typography variant={ "body2" } color={ "text.secondary" } sx={ { mb: 1 } }>{ "Subject *" }</Typography>
									 <Stack direction={ "row" } spacing={ 1 } useFlexGap flexWrap={ "wrap" }>
											{ Object.entries(SUB_MAP).map(([ key, value ]) => (
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
									 <Typography variant={ "body2" } color={ "text.secondary" } sx={ { mb: 1 } }>{ "Material *" }</Typography>
									 <Stack direction={ "row" } spacing={ 1 } useFlexGap flexWrap={ "wrap" }>
											{ Object.entries(MAT_MAP).map(([ key, value ]) => (
													  <Chip
																 key={ key }
																 label={ value }
																 clickable
																 color={ matKey === key ? "primary" : "default" }
																 variant={ matKey === key ? "filled" : "outlined" }
																 onClick={ () => setMatKey(matKey === key ? "" : key as MatKey) }
													  />
											)) }
									 </Stack>
							  </Box>
							  
							  {/* Mode-Specific Forms */ }
							  { mode === "content" && (
										 <Stack spacing={ 2.5 }>
												<TextField
														  label={ "Title" }
														  value={ contentTitle }
														  onChange={ (event) => setContentTitle(event.target.value) }
														  required fullWidth
												/>
												<TextField
														  label={ "Tags" }
														  value={ tagsInput }
														  onChange={ (event) => setTagsInput(event.target.value) }
														  required fullWidth
												/>
												<Stack spacing={ 1 }>
													  <Typography variant={ "body2" } color={ "text.secondary" }>{ "Content *" }</Typography>
													  <MDEditor
																 value={ content }
																 onChange={ (val) => setContent(val ?? "") }
																 height={ 480 }
																 preview={ "edit" }
																 textareaProps={ { placeholder: "Write content using Markdown..." } }
													  />
												</Stack>
										 </Stack>
							  ) }
							  
							  { mode === "download" && (
										 <Stack spacing={ 2.5 }>
												<Box sx={ { display: "flex", justifyContent: "center", mb: 1 } }>
													  <ToggleButtonGroup
																 value={ downloadType }
																 exclusive
																 onChange={ (_, newType: DownloadType | null) => {
																		/*TRUTHY->*/
																		!! newType && setDownloadType(newType);
																 } }
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
												
												{ downloadType === "file" && (
														  <Stack spacing={ 2 }>
																 <Box
																			onDragOver={ (event) => event.preventDefault() }
																			onDrop={ handleFilesDrop }
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
																				  onChange={ handleFilesSelect }
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
												
												{ downloadType === "url" && (
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


export default function AdminPage() {
	  const { email } = useFirebaseUserData();
	  const uid = useFirebaseUid();
	  const { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } = useFirebaseAccountModifiers();
	  const [ bgcId, setBgcId ] = React.useState("");
	  const [ bgcEmail, setBgcEmail ] = React.useState("");
	  const [ pw, setPw ] = React.useState("");
	  const [ verified, setVerified ] = React.useState(undefined);
	  
	  const invalidId = bgcId?.trim()?.length != 11;
	  
	  const [ timer, setTimer ] = React.useState<number>(-1);
	  
	  const verifyBGCId = () => {
			 if (/*TRUTHY->*/ !! invalidId || timer > -1) return;
			 setTimer(5);
	  };
	  
	  React.useEffect(() => {
			 if (timer === 0) {
					bridgeBgcId(bgcId).then(
							  (value) => {
									 setVerified(value.status === "SUCCESS" ? value.email : null);
									 setTimer(-1);
							  },
							  (reason) => {
									 setVerified(null);
									 setTimer(-1);
							  }
					);
			 } else if (timer > 0) {
					const iid = setTimeout(() => {
						  setTimer((prev) => prev - 1);
					}, 1000);
					return () => clearTimeout(iid);
			 }
	  }, [ timer, bgcId ]);
	  
	  if ( /*NOT->*/ ! uid) return (
				 <Stack spacing={ 1 } sx={ { height: "100vh", mx: "auto", p: { xs: 2, md: 4 } } } maxWidth={ 360 } justifyContent={ "center" }>
						{ verified == null && <>
							  <TextField label={ "Enter BGC ID" } value={ bgcId } onChange={ (e) => setBgcId(e.target.value) } fullWidth required/>
							  { verified === null && <Typography color={ "error" } fontSize={ 12 } textAlign={ "center" }>{ "Unauthorised BGC ID" }</Typography> }
							  <Button variant={ "contained" } fullWidth onClick={ () => verifyBGCId() } disabled={ invalidId || timer >= 0 }>{ timer > 0 ? "Verifying..." : "Verify" }</Button>
						</>
						}
						{ typeof verified === "string" && <>
							  {/* <Button variant={ "contained" } fullWidth onClick={ () => signInWithGoogle() } startIcon={ <GoogleIcon/> }>{ "Sign-In with Google" }</Button> */ }
							  <TextField label={ "Enter BGC Email" } value={ bgcEmail } onChange={ (e) => setBgcEmail(e.target.value) } fullWidth required/>
							  <TextField label={ "Enter Password" } value={ pw } onChange={ (e) => setPw(e.target.value) } fullWidth required/>
							  <Button variant={ "contained" } fullWidth onClick={ () => signInWithEmailAndPassword(bgcEmail, pw) } disabled={ verified !== bgcEmail }>{ "Sign-In" }</Button>
							  <Button variant={ "outlined" } fullWidth onClick={ () => createUserWithEmailAndPassword(bgcEmail, pw) } disabled={ verified !== bgcEmail }>{ "Sign-Up" }</Button>
						
						</> }
				 </Stack>
	  );
	  return (
				 <Stack spacing={ 3 } sx={ { mx: "auto", p: { xs: 2, sm: 3 } } }>
						<Stack direction={ { xs: "column", sm: "row" } } spacing={ 2 } alignSelf={ "center" } alignItems={ "center" }>
							  {/* <Avatar src={ photoURL } alt={ displayName } sx={ { width: 48, height: 48 } }/> */ }
							  <Branding showAppName={ false }/>
							  <Stack alignItems={ { xs: "center", sm: "flex-start" } }>
									 <Typography variant={ "h4" } color={ "primary" }>{ APP_NAME + " Builder" }</Typography>
									 <Typography variant={ "body1" } color={ "text.secondary" }>{ email }</Typography>
							  </Stack>
						</Stack>
						<Paper variant={ "outlined" } sx={ { p: { xs: 2, md: 3 } } }>
							  <AdminFormContainer
										 onContentSubmitted={ (val) => console.log("Content:", val) }
										 onDownloadSubmitted={ (val) => console.log("Download:", val) }
							  />
						</Paper>
						<Stack alignSelf={ "center" }><Button variant={ "text" } sx={ { fontSize: 12, color: "text.secondary" } } onClick={ () => signOut() }>{ "Sign-Out" }</Button></Stack>
				 </Stack>
	  );
}
