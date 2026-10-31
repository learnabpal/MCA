"use client";

import type { AthContent, AthDownload } from "@/app/AthenaeumMaster";
import { APP_NAME, SUB_MAP, type SubKey } from "@/app/AthenaeumMaster";
import { Box, Button, Chip, IconButton, Paper, Stack, TextField, ToggleButton, ToggleButtonGroup, Typography } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import React from "react";
import "@uiw/react-md-editor/markdown-editor.css";
import "@uiw/react-markdown-preview/markdown.css";
import MDEditor from "@uiw/react-md-editor";




const FORM_MODES = [ "content", "download" ] as const;
type FormMode = typeof FORM_MODES[number];

const DL_TYPES = [ "file", "url" ] as const;
type DownloadType = typeof DL_TYPES[number];

const EXTS = [ ".jpg", ".jpeg", ".png", ".gif", ".webp", ".pdf", ".doc", ".docx", ".xls", ".xlsx", ".ppt", ".pptx", ".md" ];

function AdminFormContainer({ onContentSubmit, onDownloadSubmit }: { onContentSubmit: (value: AthContent) => void; onDownloadSubmit: (value: AthDownload) => void; }) {
	  const [ mode, setMode ] = React.useState<FormMode>("content");
	  const [ sub, setSub ] = React.useState<SubKey | "">("");
	  
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
	  const isContentValid = /*TRUTHY->*/ !! (sub && contentTitle.trim() && content.trim() && validTags);
	  
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
				 ? /*TRUTHY->*/ !! (sub && selectedFiles.length > 0 && selectedFiles.every(isValidFile))
				 : /*TRUTHY->*/ !! (sub && urlPairs.length > 0 && urlPairs.every((p) => p.title.trim() && validateUrl(p.url)));
	  
	  const handleFilesDrop = (event: React.DragEvent<HTMLDivElement>) => {
			 event.preventDefault();
			 if (/*TRUTHY->*/ !! event.dataTransfer.files && event.dataTransfer.files.length > 0) {
					const filesArray = Array.from(event.dataTransfer.files).filter(isValidFile);
					setSelectedFiles((prev) => [ ...prev, ...filesArray ]);
					/* TODO: Upload files in background to storage and update URLs accordingly */
			 }
	  };
	  
	  const handleFilesSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
			 if (/*TRUTHY->*/ !! event.target.files && event.target.files.length > 0) {
					const filesArray = Array.from(event.target.files).filter(isValidFile);
					setSelectedFiles((prev) => [ ...prev, ...filesArray ]);
					/* TODO: Upload files in background to storage and update URLs accordingly */
			 }
	  };
	  
	  const handleReset = () => {
			 setSub("");
			 setTagsInput("");
			 setContentTitle("");
			 setContent("");
			 setSelectedFiles([]);
			 setUrlPairs([ { title: "", url: "" } ]);
	  };
	  
	  const handleSubmit = () => {
			 if (mode === "content") {
					if (/*NOT->*/ ! isContentValid || /*NOT->*/ ! sub) return;
					onContentSubmit({ sub, tags, title: contentTitle.trim(), content });
			 } else {
					if (/*NOT->*/ ! isDownloadValid || /*NOT->*/ ! sub) return;
					// Submitting download entries accordingly
					if (downloadType === "file") {
						  selectedFiles.forEach((file) => {
								 onDownloadSubmit({ title: file.name, url: URL.createObjectURL(file) });
						  });
					} else {
						  urlPairs.forEach((pair) => {
								 onDownloadSubmit({ title: pair.title.trim(), url: pair.url.trim() });
						  });
					}
			 }
	  };
	  
	  return (
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
						
						{/* Common Subject Selection */ }
						<Box>
							  <Typography variant={ "body2" } color={ "text.secondary" } sx={ { mb: 1 } }>{ "Subject *" }</Typography>
							  <Stack direction={ "row" } spacing={ 1 } useFlexGap flexWrap={ "wrap" }>
									 { Object.entries(SUB_MAP).map(([ key, value ]) => (
												<Chip
														  key={ key }
														  label={ value }
														  clickable
														  color={ sub === key ? "primary" : "default" }
														  variant={ sub === key ? "filled" : "outlined" }
														  onClick={ () => setSub(sub === key ? "" : key as SubKey) }
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
																	 sx={ { alignSelf: "flex-start" } }
														  >
																 { "Add Another URL Pair" }
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
	  );
}

export default function AdminPage() {
	  return (
				 <Stack spacing={ 3 } sx={ { mx: "auto", p: { xs: 2, md: 4 } } }>
						<Typography variant={ "h3" }>{ APP_NAME + " Admin" }</Typography>
						<Paper variant={ "outlined" } sx={ { p: { xs: 2, md: 3 } } }>
							  <AdminFormContainer
										 onContentSubmit={ (val) => console.log("Content:", val) }
										 onDownloadSubmit={ (val) => console.log("Download:", val) }
							  />
						</Paper>
				 </Stack>
	  );
}
