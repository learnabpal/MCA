"use client";

import { Heading } from "@/app/(public)/layout";
import { APP_NAME, ArrowBackRoundedIcon, type AthContent, type AthDownload, type AthRtdbMap, BGC_HEX_O, DownloadIcon, FileIcon, FullscreenIcon, MenuBookOutlinedIcon, NAV_ITEMS, UI_TEXTS } from "@/app/AthenaeumMaster";
import { SUB_MAP, SubKey } from "@/app/BgcMaster";
import { ATHENAEUM_DEMO_CONTENT, ATHENAEUM_DEMO_DATA } from "@/app/dummy";
import { Alert, Box, Button, Card, CardActionArea, CardContent, Chip, Grid, Stack, Typography } from "@mui/material";
import "katex/dist/katex.min.css";
import Link from "next/link";
import React, { use } from "react";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { gruvboxDark as ColourScheme } from "react-syntax-highlighter/dist/esm/styles/prism";
import rehypeKatex from "rehype-katex";
import remarkMath from "remark-math-extended";




const mdHighlighter = (Tag: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "strong") =>
		  ({ node, ...props }: React.ComponentProps<"h1"> & { node?: unknown }) => (
					 <Tag { ...props } style={ { ...ColourScheme.keyword, margin: "1.2em 0 0.5em", ...props.style } }/>
		  );


export default function SubjectPage({ params }: { params: Promise<{ sub: string }> }) {
	  const { sub } = use(params);
	  const subject = sub as SubKey;
	  const subjectName = SUB_MAP[subject];
	  const [ contents, setContents ] = React.useState<Record<string, string>>({});
	  const [ downloads, setDownloads ] = React.useState<Record<string, AthDownload>>({});
	  const [ selectedTag, setSelectedTag ] = React.useState<string | null>(null);
	  const [ selectedContent, setSelectedContent ] = React.useState<AthContent | null>(null);
	  const [ loading, setLoading ] = React.useState(true);
	  
	  React.useEffect(() => {
			 setLoading(true);
			 setSelectedTag(null);
			 setSelectedContent(null);
			 if (  /*NOT->*/ ! subjectName) {
					setContents({});
					setDownloads({});
					setLoading(false);
					return;
			 }
			 const cacheKey = `${ APP_NAME }-subject-map-${ subject }`;
			 const cached = localStorage.getItem(cacheKey);
			 const index: NonNullable<AthRtdbMap["subject"][SubKey]> = cached ?
						JSON.parse(cached) :
						(ATHENAEUM_DEMO_DATA.subject[subject] || { contents: {}, downloads: {} });
			 if (  /*NOT->*/ ! cached) localStorage.setItem(cacheKey, JSON.stringify(index));
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
	  
	  if (  /*NOT->*/ ! subjectName) return <Alert severity={ "warning" }>{ "Subject not found." }</Alert>;
	  
	  return <Stack spacing={ 3 }>
			 <Button component={ Link } variant={ "text" } href={ NAV_ITEMS.subjects.href } startIcon={ <ArrowBackRoundedIcon/> } sx={ { px: 0, color: BGC_HEX_O, alignSelf: "flex-start" } }>
					{ "All Subjects" }
			 </Button>
			 <Heading title={ subjectName } subtitle={ UI_TEXTS.subject }/>
			 { loading ? <Typography color={ "text.secondary" }>{ "Loading..." }</Typography> : <>
					{ Object.keys(downloads).length > 0 && <Box>
						  <Typography variant={ "h5" } sx={ { mb: 2 } }>{ "Downloads" }</Typography>
						  <Grid container spacing={ 2 }>
								 { Object.entries(downloads).map(([ id, download ]) => (
											<Grid key={ id } size={ { xs: 12, sm: 6, md: 4 } } sx={ { flexGrow: 1 } }>
												  <Card variant={ "outlined" } sx={ { height: "100%" } }>
														 <CardActionArea component={ "a" } href={ download.url } target={ "_blank" } rel={ "noopener noreferrer" } download sx={ { height: "100%" } }>
																<CardContent sx={ { display: "flex", alignItems: "center", gap: 2, p: 2 } }>
																	  <FileIcon color={ "action" }/>
																	  <Typography sx={ { fontWeight: 600, flex: 1 } }>{ download.title }</Typography>
																	  <DownloadIcon color={ "action" }/>
																</CardContent>
														 </CardActionArea>
												  </Card>
											</Grid>
								 )) }
						  </Grid>
					</Box> }
					<Box>
						  <Typography variant={ "h5" } sx={ { mb: 2 } }>{ "Tags" }</Typography>
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
						  <Typography variant={ "h5" } sx={ { mb: 2 } }>{ "Content" }</Typography>
						  { filteredContents.length > 0 ? <Grid container spacing={ 2 }>
								 { filteredContents.map(({ id, title, content }) => (
											<Grid key={ id } size={ { xs: 12, sm: 6, md: 4 } } sx={ { flexGrow: 1 } }>
												  <Card variant={ "outlined" } sx={ { height: "100%", borderColor: selectedContent?.title === content.title ? "primary.main" : "divider" } }>
														 <CardActionArea onClick={ () => {
																const cacheKey = `${ APP_NAME }-content-map-${ subject }-${ id }`;
																const cached = localStorage.getItem(cacheKey);
																const selected = cached ? JSON.parse(cached) as AthContent : content;
																if (  /*NOT->*/ ! cached) localStorage.setItem(cacheKey, JSON.stringify(selected));
																setSelectedContent(selected);
														 } } sx={ { height: "100%" } }>
																<CardContent sx={ { display: "flex", alignItems: "center", gap: 2, p: 2 } }>
																	  <MenuBookOutlinedIcon color={ "action" }/>
																	  <Typography sx={ { flex: 1, fontWeight: 600 } }>{ title }</Typography>
																	  <FullscreenIcon color={ "action" }/>
																</CardContent>
														 </CardActionArea>
												  </Card>
											</Grid>
								 )) }
						  </Grid> : <Typography color={ "text.secondary" }>{ "No content is available for this selection." }</Typography> }
					</Box>
					{ selectedContent && <Card variant={ "outlined" }>
						  <CardContent sx={ { p: { xs: 2, md: 3 } } }>
								 <Typography variant={ "h5" } sx={ { mb: 2, color: ColourScheme.keyword.color } }>{ selectedContent.title }</Typography>
								 <Box sx={ { height: 2, width: "100%", backgroundColor: ColourScheme.keyword.color, borderRadius: 1 } }/>
								 {/* <ReactMarkdown>{ selectedContent.content }</ReactMarkdown> */ }
								 <ReactMarkdown
											children={ selectedContent.src }
											remarkPlugins={ [ [ remarkMath, { backslashDelimiters: true } ] ] }
											rehypePlugins={ [ rehypeKatex ] }
											components={ {
												  h1: mdHighlighter("h1"),
												  h2: mdHighlighter("h2"),
												  h3: mdHighlighter("h3"),
												  h4: mdHighlighter("h4"),
												  h5: mdHighlighter("h5"),
												  h6: mdHighlighter("h6"),
												  strong: mdHighlighter("strong"),
												  code(props) {
														 const { children, className, node, ...rest } = props;
														 const match = /language-(\w+)/.exec(className || "");
														 return match ? (
																	<SyntaxHighlighter
																			  { ...rest }
																			  PreTag="div"
																			  children={ String(children).replace(/\n$/, "") }
																			  language={ match[1] }
																			  style={ ColourScheme }
																			  customStyle={ { fontWeight: "bold" } }
																	/>
														 ) : (
																	<code
																			  { ...rest }
																			  className={ className }
																			  style={ {
																					 ...ColourScheme["code[class*=\"language-\"]"],
																					 display: "inline",
																					 whiteSpace: "normal",
																					 fontWeight: "bold",
																					 padding: "0.15em 0.35em",
																					 // borderRadius: 4,
																					 // fontSize: "0.875em",
																					 ...rest.style
																			  } }
																	>
																		  { children }
																	</code>
														 );
												  }
											} }
								 />
						  </CardContent>
					</Card> }
			 </> as any }
	  </Stack>;
}
