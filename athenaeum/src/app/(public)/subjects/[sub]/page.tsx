"use client";

import { Heading } from "@/app/(public)/layout";
import DevMarkdown, { ColourScheme } from "@/app/DevMarkdown";
import { APP_NAME, ArrowBackRoundedIcon, type AthAsset, type AthRtdbMap, BGC_HEX_O, content, download, DownloadIcon, FileIcon, FullscreenIcon, MenuBookOutlinedIcon, NAV_ITEMS, UI_TEXTS } from "@/app/AthenaeumMaster";
import { SUB_MAP, SubKey } from "@/app/BgcMaster";
import { ATHENAEUM_DEMO_CONTENT, ATHENAEUM_DEMO_DATA } from "@/app/dummy";
import { Alert, Box, Button, Card, CardActionArea, CardContent, Grid, Stack, Typography } from "@mui/material";
import "katex/dist/katex.min.css";
import Link from "next/link";
import React, { use } from "react";




export default function SubjectPage({ params }: { params: Promise<{ sub: string }> }) {
	  const { sub } = use(params);
	  const subject = sub as SubKey;
	  const subjectName = SUB_MAP[subject];
	  const [ contents, setContents ] = React.useState<Record<string, string>>({});
	  const [ downloads, setDownloads ] = React.useState<Record<string, AthAsset>>({});
	  const [ selectedContent, setSelectedContent ] = React.useState<AthAsset | null>(null);
	  const [ loading, setLoading ] = React.useState(true);
	  
	  React.useEffect(() => {
			 setLoading(true);
			 setSelectedContent(null);
			 if (  /*NOT->*/ ! subjectName) {
					setContents({});
					setDownloads({});
					setLoading(false);
					return;
			 }
			 const cacheKey = `${ APP_NAME }-subject-map-${ subject }`;
			 const cachedMap = localStorage.getItem(cacheKey);
			 localStorage.removeItem(cacheKey);
			 const index: AthRtdbMap[ "subject" ][ SubKey ] = cachedMap ?
						JSON.parse(cachedMap) :
						(ATHENAEUM_DEMO_DATA.subject[subject] || { [content]: {}, [download]: {} });
			 if (  /*NOT->*/ ! cachedMap) localStorage.setItem(cacheKey, JSON.stringify(index));
			 setContents(index.content || {});
			 setDownloads(index.download || {});
			 setLoading(false);
	  }, [ subject, subjectName ]);
	  
	  const indexedContents = Object.entries(contents).flatMap(([ id, title ]) => {
			 const content = ATHENAEUM_DEMO_CONTENT[id];
			 return content && content.sub === subject ? [ { id, title, content } ] : [];
	  });
	  
	  if (  /*NOT->*/ ! subjectName) return <Alert severity={ "warning" }>{ "Subject not found." }</Alert>;
	  if (loading) return <Typography color={ "text.secondary" }>{ "Loading..." }</Typography>;
	  
	  return <Stack spacing={ 3 }>
			 <Button component={ Link } variant={ "text" } href={ NAV_ITEMS.subjects.href } startIcon={ <ArrowBackRoundedIcon/> } sx={ { px: 0, color: BGC_HEX_O, alignSelf: "flex-start" } }>
					{ "All Subjects" }
			 </Button>
			 <Heading title={ subjectName } subtitle={ UI_TEXTS.subject }/>
			 
			 { Object.keys(downloads).length > 0 && <Box>
					<Typography variant={ "h5" } sx={ { mb: 2 } }>{ "Downloads" }</Typography>
					<Grid container spacing={ 2 }>
						  { Object.entries(downloads).map(([ id, asset ]) => (
									 <Grid key={ id } size={ { xs: 12, sm: 6, md: 4 } } sx={ { flexGrow: 1 } }>
											<Card variant={ "outlined" } sx={ { height: "100%" } }>
												  <CardActionArea component={ "a" } href={ asset.src } target={ "_blank" } rel={ "noopener noreferrer" } download sx={ { height: "100%" } }>
														 <CardContent sx={ { display: "flex", alignItems: "center", gap: 2, p: 2 } }>
																<FileIcon color={ "action" }/>
																<Typography sx={ { fontWeight: 600, flex: 1 } }>{ asset.title }</Typography>
																<DownloadIcon color={ "action" }/>
														 </CardContent>
												  </CardActionArea>
											</Card>
									 </Grid>
						  )) }
					</Grid>
			 </Box> }
			 <Box>
					<Typography variant={ "h5" } sx={ { mb: 2 } }>{ "Content" }</Typography>
					{ indexedContents.length > 0 ?
							  <Grid container spacing={ 2 }>
									 { indexedContents.map(({ id, title, content }) =>
												content && <Grid key={ id } size={ { xs: 12, sm: 6, md: 4 } } sx={ { flexGrow: 1 } }>
													  <Card variant={ "outlined" } sx={ { height: "100%", borderColor: selectedContent?.title === content.title ? "primary.main" : "divider" } }>
															 <CardActionArea
																		onClick={ () => {
																			  const cacheKey = `${ APP_NAME }-content-map-${ subject }-${ id }`;
																			  const cached = localStorage.getItem(cacheKey);
																			  const selected = cached ? JSON.parse(cached) as AthAsset : content;
																			  if (  /*NOT->*/ ! cached) localStorage.setItem(cacheKey, JSON.stringify(selected));
																			  setSelectedContent(selected);
																		} }
																		sx={ { height: "100%" } }
															 >
																	<CardContent sx={ { display: "flex", alignItems: "center", gap: 2, p: 2 } }>
																		  <MenuBookOutlinedIcon color={ "action" }/>
																		  <Typography sx={ { flex: 1, fontWeight: 600 } }>{ title }</Typography>
																		  <FullscreenIcon color={ "action" }/>
																	</CardContent>
															 </CardActionArea>
													  </Card>
												</Grid>) }
							  </Grid>
							  : <Typography color={ "text.secondary" }>{ "No content is available." }</Typography>
					}
			 </Box>
			 { selectedContent && <Card variant={ "outlined" }>
					<CardContent sx={ { p: { xs: 2, md: 3 } } }>
						  <Typography variant={ "h5" } sx={ { mb: 2, color: ColourScheme.keyword.color } }>{ selectedContent.title }</Typography>
						  <Box sx={ { height: 2, width: "100%", backgroundColor: ColourScheme.keyword.color, borderRadius: 1 } }/>
						  <DevMarkdown text={ selectedContent.src }/>
					</CardContent>
			 </Card> }
	  </Stack>;
}
