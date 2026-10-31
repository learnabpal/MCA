"use client";

import type { AthContent, AthDownload } from "@/app/AthenaeumMaster";
import { APP_NAME, SUB_MAP, type SubKey } from "@/app/AthenaeumMaster";
import { Box, Button, Chip, Paper, Stack, TextField, Typography } from "@mui/material";
import React from "react";
import "@uiw/react-md-editor/markdown-editor.css";
import "@uiw/react-markdown-preview/markdown.css";
import MDEditor from "@uiw/react-md-editor";




function ContentForm({ onSubmit }: { onSubmit: (value: AthContent) => void }) {
	  const [ sub, setSub ] = React.useState<SubKey | "">("");
	  const [ tagsInput, setTagsInput ] = React.useState("");
	  const [ title, setTitle ] = React.useState("");
	  const [ content, setContent ] = React.useState("");
	  const tags = tagsInput.split(",").map((tag) => tag.trim()).filter(Boolean);
	  const validTags = tagsInput.trim().length > 0 && tags.every(Boolean) && new Set(tags).size === tags.length;
	  const isValid = sub && title.trim() && content.trim() && validTags;
	  
	  return (
				 <Stack spacing={ 2.5 }>
						<Typography variant={ "h5" }>{ "Content" }</Typography>
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
						<TextField
								  label={ "Title" }
								  value={ title }
								  onChange={ (event) => setTitle(event.target.value) }
								  required fullWidth
						/>
						<TextField
								  label={ "Tags" }
								  value={ tagsInput }
								  onChange={ (event) => setTagsInput(event.target.value) }
								  required fullWidth
						/>
						{/* <TextField label={ "Content" } value={ content } onChange={ (event) => setContent(event.target.value) } required multiline minRows={ 10 } fullWidth/> */ }
						<Stack spacing={ 1 }>
							  <Typography variant={ "body2" } color={ "text.secondary" }>{ "Content *" }</Typography>
							  <MDEditor
										 value={ content }
										 onChange={ (value) => setContent(value ?? "") }
										 height={ 480 }
										 preview={ "edit" }
										 textareaProps={ { placeholder: "Write content using Markdown..." } }
							  />
						</Stack>
						<Stack direction={ "row" } spacing={ 1 }>
							  <Button variant={ "outlined" } fullWidth onClick={ () => {
									 setSub("");
									 setTagsInput("");
									 setTitle("");
									 setContent("");
							  } }>{ "Cancel" }</Button>
							  <Button variant={ "contained" } disabled={ ! isValid } fullWidth onClick={ () => {
									 if ( ! isValid || ! sub) return;
									 onSubmit({ sub, tags, title: title.trim(), content });
							  } }>{ "Submit Content" }</Button>
						</Stack>
				 </Stack>
	  );
}

function DownloadForm({ onSubmit }: { onSubmit: (value: AthDownload) => void }) {
	  const [ title, setTitle ] = React.useState("");
	  const [ url, setUrl ] = React.useState("");
	  const validUrl = (() => {
			 try {
					const parsed = new URL(url.trim());
					return (parsed.protocol === "https:" || parsed.protocol === "http:") && (parsed.hostname);
			 } catch {
					return false;
			 }
	  })();
	  const isValid = title.trim() && validUrl;
	  
	  return (
				 <Stack spacing={ 2.5 }>
						<Typography variant={ "h5" }>{ "Download" }</Typography>
						<TextField label={ "Title" } value={ title } onChange={ (event) => setTitle(event.target.value) } required fullWidth/>
						<TextField label={ "URL" } value={ url } onChange={ (event) => setUrl(event.target.value) } error={ url.trim() && ! validUrl } helperText={ url.trim() && ! validUrl ? "Enter a valid HTTP or HTTPS URL." : " " } required fullWidth/>
						<Stack direction={ "row" } spacing={ 1 }>
							  <Button variant={ "outlined" } fullWidth onClick={ () => {
									 setTitle("");
									 setUrl("");
							  } }>{ "Cancel" }</Button>
							  <Button variant={ "contained" } disabled={ ! isValid } fullWidth onClick={ () => {
									 if ( ! isValid) return;
									 onSubmit({ title: title.trim(), url: url.trim() });
							  } }>{ "Submit Download" }</Button>
						</Stack>
				 </Stack>
	  );
}

export default function AdminPage() {
	  const [ authed, setAuthed ] = React.useState(false);
	  const [ value, setValue ] = React.useState({});
	  // if ( /*NOT->*/ ! authed) return (
	  // 		 <Stack spacing={ 3 } maxWidth={ "sm" } sx={ { mx: "auto", p: { xs: 2, md: 4 } } }>
	  // 				<TextField value={ value[0] || "" } onChange={ (e) => setValue(prevState => ({ ...prevState, [0]: e.target.value })) }/>
	  // 				<TextField value={ value[1] || "" } onChange={ (e) => setValue(prevState => ({ ...prevState, [1]: e.target.value })) }/>
	  // 				<TextField value={ value[2] || "" } onChange={ (e) => setValue(prevState => ({ ...prevState, [2]: e.target.value })) }/>
	  // 		 </Stack>
	  // );
	  return (
				 <Stack spacing={ 3 } sx={ { mx: "auto", p: { xs: 2, md: 4 } } }>
						<Typography variant={ "h3" }>{ APP_NAME + " Admin" }</Typography>
						<Paper variant={ "outlined" } sx={ { p: { xs: 2, md: 3 } } }>
							  <ContentForm onSubmit={ (value) => console.log(value) }/>
						</Paper>
						<Paper variant={ "outlined" } sx={ { p: { xs: 2, md: 3 } } }>
							  <DownloadForm onSubmit={ (value) => console.log(value) }/>
						</Paper>
				 </Stack>
	  );
}
