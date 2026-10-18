"use client";

import { use, useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import { ATHENAEUM_DEMO_CONTENT, ATHENAEUM_DEMO_DATA } from "@/app/dummy";
import { NAV_ITEMS, SUB_MAP, type AthContent, type AthDownload, type AthRtdbMap, type SubKey, MenuBookOutlinedIcon, DownloadIcon, ArrowBackRoundedIcon, ArrowForwardRoundedIcon, FullscreenIcon, FileIcon } from "@/app/AthenaeumMaster";
import { Alert, Box, Button, Card, CardActionArea, CardContent, Chip, IconButton, Stack, Typography } from "@mui/material";
import Link from "next/link";




export default function SubjectPage({ params }: { params: Promise<{ sub: string }> }) {
	  const { sub } = use(params);
	  const subject = sub as SubKey;
	  const subjectName = SUB_MAP[subject];
	  const [ contents, setContents ] = useState<Record<string, string>>({});
	  const [ downloads, setDownloads ] = useState<Record<string, AthDownload>>({});
	  const [ selectedTag, setSelectedTag ] = useState<string | null>(null);
	  const [ selectedContent, setSelectedContent ] = useState<AthContent | null>(null);
	  const [ loading, setLoading ] = useState(true);
	  
	  useEffect(() => {
			 setLoading(true);
			 setSelectedTag(null);
			 setSelectedContent(null);
			 if ( ! subjectName) {
					setContents({});
					setDownloads({});
					setLoading(false);
					return;
			 }
			 const cacheKey = `athenaeum-index-${ subject }`;
			 const cachedIndex = localStorage.getItem(cacheKey);
			 const index: NonNullable<AthRtdbMap["subject"][SubKey]> = cachedIndex ? JSON.parse(cachedIndex) : ATHENAEUM_DEMO_DATA.subject[subject] || { contents: {}, downloads: {} };
			 if ( ! cachedIndex) localStorage.setItem(cacheKey, JSON.stringify(index));
			 setContents(index.contents || {});
			 setDownloads(index.downloads || {});
			 setLoading(false);
	  }, [ subject, subjectName ]);
	  
	  const indexedContents = Object.entries(contents).flatMap(([ id, title ]) => {
			 const content = ATHENAEUM_DEMO_CONTENT[id];
			 return content && content.sub === subject ? [ { id, title, content } ] : [];
	  });
	  const availableTags = [ ...new Set(indexedContents.flatMap(({ content }) => content.tags)) ];
	  const filteredContents = selectedTag ? indexedContents.filter(({ content }) => content.tags.includes(selectedTag)) : indexedContents;
	  
	  if ( ! subjectName) return <Alert severity={ "warning" }>{ "Subject not found." }</Alert>;
	  
	  return <Stack spacing={ 3 }>
			 <Button component={ Link } variant={ "text" } href={ NAV_ITEMS.subjects.href } startIcon={ <ArrowBackRoundedIcon/> } sx={ { alignSelf: "flex-start" } }>
					{ "All Subjects" }
			 </Button>
			 <Box>
					<Typography variant={ "h3" } sx={ { fontWeight: 800, mb: 1 } }>{ subjectName }</Typography>
					<Typography color={ "text.secondary" }>{ "Browse the available content and subject resources." }</Typography>
			 </Box>
			 { loading ? <Typography color={ "text.secondary" }>{ "Loading..." }</Typography> : <>
					{ Object.keys(downloads).length > 0 && <Box>
						  <Typography variant={ "h5" } sx={ { fontWeight: 700, mb: 2 } }>{ "Downloads" }</Typography>
						  <Stack spacing={ 1.5 }>
								 { Object.entries(downloads).map(([ id, download ]) => (
											<Card key={ id } variant={ "outlined" }>
												  <CardActionArea>
														 <CardContent sx={ { display: "flex", alignItems: "center", gap: 2, p: 2 } }>
																<FileIcon color={ "action" }/>
																<Typography sx={ { fontWeight: 600, flex: 1 } }>{ download.title }</Typography>
																<IconButton component={ "a" } href={ download.url } target={ "_blank" } rel={ "noopener noreferrer" } download sx={ { m: 0 } }>
																	  <DownloadIcon/>
																</IconButton>
														 </CardContent>
												  </CardActionArea>
											</Card>
								 )) }
						  </Stack>
					</Box> }
					<Box>
						  <Typography variant={ "h5" } sx={ { fontWeight: 700, mb: 2 } }>{ "Tags" }</Typography>
						  { availableTags.length > 0 ? <Stack direction={ "row" } spacing={ 1 } useFlexGap flexWrap={ "wrap" }>
								 { availableTags.map((tag) => (
											<Chip
													  key={ tag }
													  label={ tag }
													  clickable
													  color={ selectedTag === tag ? "primary" : "default" }
													  variant={ selectedTag === tag ? "filled" : "outlined" }
													  onClick={ () => {
															 setSelectedTag((current) => current === tag ? null : tag);
															 setSelectedContent(null);
													  } }
											/>
								 )) }
						  </Stack> : <Typography color={ "text.secondary" }>{ "No tags are available." }</Typography> }
					</Box>
					<Box>
						  <Typography variant={ "h5" } sx={ { fontWeight: 700, mb: 2 } }>{ "Content" }</Typography>
						  { filteredContents.length > 0 ? <Stack spacing={ 1.5 }>
								 { filteredContents.map(({ id, title, content }) => (
											<Card key={ id } variant={ "outlined" } sx={ { borderColor: selectedContent?.title === content.title ? "primary.main" : "divider" } }>
												  <CardActionArea onClick={ () => {
														 const cacheKey = `athenaeum-content-${ subject }-${ id }`;
														 const cached = localStorage.getItem(cacheKey);
														 const selected = cached ? JSON.parse(cached) as AthContent : content;
														 if ( ! cached) localStorage.setItem(cacheKey, JSON.stringify(selected));
														 setSelectedContent(selected);
												  } }>
														 <CardContent sx={ { display: "flex", alignItems: "center", gap: 2, p: 2 } }>
																<MenuBookOutlinedIcon color={ "action" }/>
																<Typography sx={ { flex: 1, fontWeight: 600 } }>{ title }</Typography>
																<FullscreenIcon color={ "action" }/>
														 </CardContent>
												  </CardActionArea>
											</Card>
								 )) }
						  </Stack> : <Typography color={ "text.secondary" }>{ "No content is available for this selection." }</Typography> }
					</Box>
					{ selectedContent && <Card variant={ "outlined" }>
						  <CardContent sx={ { p: { xs: 2, md: 3 } } }>
								 <Typography variant={ "h5" } sx={ { fontWeight: 750, mb: 2 } }>{ selectedContent.title }</Typography>
								 <Box
											// sx={ {
											// 	  overflowWrap: "anywhere", lineHeight: 1.85,
											// 	  "& h1, & h2, & h3, & h4": { lineHeight: 1.3, mt: 3, mb: 1 },
											// 	  "& p": { my: 1.5 },
											// 	  "& ul, & ol": { pl: 3, my: 1.5 },
											// 	  "& li": { mb: 0.75 },
											// 	  "& pre": { p: 2, overflowX: "auto", borderRadius: 2, bgcolor: "background.default" },
											// 	  "& code": { fontFamily: "monospace", overflowWrap: "anywhere" },
											// 	  "& blockquote": { m: 0, my: 2, pl: 2, borderLeft: 3, borderColor: "divider", color: "text.secondary" },
											// 	  "& a": { color: "primary.main" }
											// } }
								 >
										<ReactMarkdown>{ selectedContent.content }</ReactMarkdown>
								 </Box>
						  </CardContent>
					</Card> }
			 </> as any }
	  </Stack>;
}
