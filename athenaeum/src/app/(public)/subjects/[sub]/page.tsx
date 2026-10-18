"use client";

import { ATHENAEUM_DEMO_CONTENT, ATHENAEUM_DEMO_DATA } from "@/app/dummy";
import { use } from "react";
import React from "react";
import { NAV_ITEMS, SUB_MAP, type AthContent, type AthDownload, type SubKey } from "@/app/AthenaeumMaster";
import ArrowBackRounded from "@mui/icons-material/ArrowBackRounded";
import DownloadOutlined from "@mui/icons-material/DownloadOutlined";
import MenuBookOutlined from "@mui/icons-material/MenuBookOutlined";
import PictureAsPdfOutlined from "@mui/icons-material/PictureAsPdfOutlined";
import { Alert, Box, Button, Card, CardActionArea, CardContent, Chip, Stack, Typography } from "@mui/material";
import Link from "next/link";
import { useEffect, useState } from "react";




export default function SubjectPage({ params }: { params: Promise<{ sub: string }> }) {
	  const { sub } = use(params);
	  const subject = sub as SubKey;
	  const subjectName = SUB_MAP[subject];
	  const [ topics, setTopics ] = useState<Record<string, string>>({});
	  const [ downloads, setDownloads ] = useState<Record<string, AthDownload>>({});
	  const [ selectedContent, setSelectedContent ] = useState<AthContent | null>(null);
	  const [ loading, setLoading ] = useState(true);
	  
	  useEffect(() => {
			 if ( ! subjectName) {
					setLoading(false);
					return;
			 }
			 const cachedIndex = localStorage.getItem(`athenaeum-index-${ subject }`);
			 const index = cachedIndex ? JSON.parse(cachedIndex) : ATHENAEUM_DEMO_DATA.subject[subject] || {};
			 if ( ! cachedIndex) localStorage.setItem(`athenaeum-index-${ subject }`, JSON.stringify(index));
			 setTopics(index.contents || {});
			 setDownloads(index.downloads || {});
			 setLoading(false);
	  }, [ subject, subjectName ]);
	  
	  const openTopic = (id: string) => {
			 const cacheKey = `athenaeum-content-${ id }`;
			 const cached = localStorage.getItem(cacheKey);
			 if (cached) {
					setSelectedContent(JSON.parse(cached) as AthContent);
					return;
			 }
			 const content = ATHENAEUM_DEMO_CONTENT[id];
			 if (content) {
					localStorage.setItem(cacheKey, JSON.stringify(content));
					setSelectedContent(content);
			 }
	  };
	  
	  if ( ! subjectName) return <Alert severity={ "warning" }>{ "Subject not found." }</Alert>;
	  
	  return <Stack spacing={ 3 }>
			 <Button component={ Link } href={ NAV_ITEMS.subjects.href } startIcon={ <ArrowBackRounded/> } sx={ { alignSelf: "flex-start" } }>{ "All Subjects" }</Button>
			 <Box>
					<Typography variant={ "h3" } sx={ { fontWeight: 800, mb: 1 } }>{ subjectName }</Typography>
					<Typography color={ "text.secondary" }>{ "Available topics and subject resources." }</Typography>
			 </Box>
			 { loading ? <Typography color={ "text.secondary" }>{ "Loading..." }</Typography> : <>
					{ Object.keys(downloads).length > 0 && <Box>
						  <Typography variant={ "h5" } sx={ { fontWeight: 700, mb: 2 } }>{ "Downloads" }</Typography>
						  <Stack spacing={ 1.5 }>
								 { Object.entries(downloads).map(([ id, download ]) => <Card key={ id } variant={ "outlined" }>
										<CardContent sx={ { display: "flex", alignItems: "center", gap: 2, p: 2 } }>
											  <PictureAsPdfOutlined color={ "action" }/>
											  <Box sx={ { flex: 1, minWidth: 0 } }>
													 <Typography sx={ { fontWeight: 650 } }>{ download.title }</Typography>
											  </Box>
											  <Button component={ "a" } href={ download.url } target={ "_blank" } rel={ "noopener noreferrer" } download endIcon={ <DownloadOutlined/> }>{ "Download" }</Button>
										</CardContent>
								 </Card>) }
						  </Stack>
					</Box> }
					<Box>
						  <Typography variant={ "h5" } sx={ { fontWeight: 700, mb: 2 } }>{ "Topics" }</Typography>
						  { Object.keys(topics).length === 0 ? <Typography color={ "text.secondary" }>{ "No topics are available yet." }</Typography> : <Stack spacing={ 1.5 }>
								 { Object.entries(topics).map(([ id, title ]) => <Card key={ id } variant={ "outlined" }>
										<CardActionArea onClick={ () => openTopic(id) }>
											  <CardContent sx={ { display: "flex", alignItems: "center", gap: 2, p: 2 } }>
													 <MenuBookOutlined color={ "action" }/>
													 <Typography sx={ { flex: 1, fontWeight: 600 } }>{ title }</Typography>
													 <ArrowBackRounded sx={ { transform: "rotate(180deg)" } } color={ "action" }/>
											  </CardContent>
										</CardActionArea>
								 </Card>) }
						  </Stack> }
					</Box>
					{ selectedContent && <Card variant={ "outlined" }>
						  <CardContent sx={ { p: { xs: 2, md: 3 } } }>
								 <Typography variant={ "h5" } sx={ { fontWeight: 750, mb: 2 } }>{ selectedContent.title }</Typography>
								 <Stack direction={ "row" } spacing={ 1 } useFlexGap flexWrap={ "wrap" } sx={ { mb: 2 } }>
										{ selectedContent.tags.map((tag) => <Chip key={ tag } label={ tag } size={ "small" } variant={ "outlined" }/>) }
								 </Stack>
								 <Typography component={ "div" } sx={ { whiteSpace: "pre-wrap", lineHeight: 1.85 } }>{ selectedContent.content }</Typography>
						  </CardContent>
					</Card> }
			 </> }
	  </Stack>;
}
