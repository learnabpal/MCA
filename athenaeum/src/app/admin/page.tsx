"use client";

import type { AthContent, AthDownload } from "@/app/AthenaeumMaster";
import { APP_NAME, SUB_MAP, type SubKey } from "@/app/AthenaeumMaster";
import { Box, Button, Chip, Paper, Stack, TextField, ToggleButton, ToggleButtonGroup, Typography } from "@mui/material";
import React from "react";
import "@uiw/react-md-editor/markdown-editor.css";
import "@uiw/react-markdown-preview/markdown.css";
import MDEditor from "@uiw/react-md-editor";




const MODES = [ "content", "download" ] as const;
type FormMode = typeof MODES[number];

function AdminFormContainer({ onContentSubmit, onDownloadSubmit }: { onContentSubmit: (value: AthContent) => void; onDownloadSubmit: (value: AthDownload) => void; }) {
	  const [ mode, setMode ] = React.useState<FormMode>("content");
	  const [ sub, setSub ] = React.useState<SubKey | "">("");
	  
	  /* Content Form State */
	  const [ tagsInput, setTagsInput ] = React.useState("");
	  const [ contentTitle, setContentTitle ] = React.useState("");
	  const [ content, setContent ] = React.useState("");
	  
	  /* Download Form State */
	  const [ downloadTitle, setDownloadTitle ] = React.useState("");
	  const [ url, setUrl ] = React.useState("");
	  const [ selectedFile, setSelectedFile ] = React.useState<File | null>(null);
	  
	  /* Derived State for Content */
	  const tags = tagsInput.split(",").map((tag) => tag.trim()).filter(Boolean);
	  const validTags = tagsInput.trim().length > 0 && tags.every(Boolean) && new Set(tags).size === tags.length;
	  const isContentValid = /*TRUTHY->*/ !! (sub && contentTitle.trim() && content.trim() && validTags);
	  
	  /* Derived State for Download */
	  const validUrl = (() => {
			 try {
					const parsed = new URL(url.trim());
					return (parsed.protocol === "https:" || parsed.protocol === "http:") && /*TRUTHY->*/ !! parsed.hostname;
			 } catch {
					return false;
			 }
	  })();
	  const isDownloadValid = /*TRUTHY->*/ !! (sub && downloadTitle.trim() && validUrl);
	  
	  const handleFileDrop = (event: React.DragEvent<HTMLDivElement>) => {
			 event.preventDefault();
			 if (event.dataTransfer.files && event.dataTransfer.files[0]) {
					const file = event.dataTransfer.files[0];
					handleUpload(file);
			 }
	  };
	  
	  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
			 if (event.target.files && event.target.files[0]) {
					const file = event.target.files[0];
					handleUpload(file);
			 }
	  };
	  
	  const handleUpload = (file: File) => {
			 setSelectedFile(file);
			 setDownloadTitle(file.name);
			 /* TODO: Upload file to storage and setUrl with the resulting download URL */
	  };
	  
	  const handleReset = () => {
			 setSub("");
			 setTagsInput("");
			 setContentTitle("");
			 setContent("");
			 setDownloadTitle("");
			 setUrl("");
			 setSelectedFile(null);
	  };
	  
	  const handleSubmit = () => {
			 if (mode === "content") {
					if (/*NOT->*/ ! isContentValid || /*NOT->*/ ! sub) return;
					onContentSubmit({ sub, tags, title: contentTitle.trim(), content });
			 } else {
					if (/*NOT->*/ ! isDownloadValid || /*NOT->*/ ! sub) return;
					onDownloadSubmit({ title: downloadTitle.trim(), url: url.trim() });
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
												if (newMode !== null) setMode(newMode);
										 } }
										 color={ "primary" }
							  >
									 { MODES.map((value) => (
												<ToggleButton key={ value } value={ value } sx={ { px: 4 } }>{ value }</ToggleButton>
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
						{ mode === "content" ? (
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
						) : (
								  <Stack spacing={ 2.5 }>
										 <Box
													onDragOver={ (event) => event.preventDefault() }
													onDrop={ handleFileDrop }
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
														  style={ { display: "none" } }
														  onChange={ handleFileSelect }
												/>
												<Typography variant={ "body1" } color={ "text.secondary" }>
													  { selectedFile ? `Selected: ${ selectedFile.name }` : "Drag & drop a file here, or click to select" }
												</Typography>
										 </Box>
										 <TextField
													label={ "Filename (Title)" }
													value={ downloadTitle }
													slotProps={ { input: { readOnly: true } } }
													required fullWidth
										 />
										 <TextField
													label={ "URL" }
													value={ url }
													onChange={ (event) => setUrl(event.target.value) }
													error={ /*TRUTHY->*/ !! (url.trim() && /*NOT->*/ ! validUrl) }
													helperText={ url.trim() && /*NOT->*/ ! validUrl ? "Enter a valid HTTP or HTTPS URL." : " " }
													required fullWidth
										 />
								  </Stack>
						) }
						
						{/* Action Buttons */ }
						<Stack direction={ "row" } spacing={ 1 }>
							  <Button variant={ "outlined" } fullWidth onClick={ handleReset }>{ "Cancel" }</Button>
							  <Button
										 variant={ "contained" }
										 disabled={ mode === "content" ? /*NOT->*/ ! isContentValid : /*NOT->*/ ! isDownloadValid }
										 fullWidth
										 onClick={ handleSubmit }
							  >
									 { mode === "content" ? "Submit Content" : "Submit Download" }
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
