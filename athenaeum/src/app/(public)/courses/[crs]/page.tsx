"use client";

import { SubjectCard } from "@/app/(public)/subjects/page";
import React, { use, useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import { ATHENAEUM_DEMO_CONTENT, ATHENAEUM_DEMO_DATA } from "@/app/dummy";
import { NAV_ITEMS, SUB_MAP, type AthContent, type AthDownload, type AthRtdbMap, type SubKey, MenuBookOutlinedIcon, DownloadIcon, ArrowBackRoundedIcon, ArrowForwardRoundedIcon, FullscreenIcon, FileIcon, CrsKey, COURSES } from "@/app/AthenaeumMaster";
import { Alert, Box, Button, Card, CardActionArea, CardContent, Chip, Divider, Grid, IconButton, Stack, Typography } from "@mui/material";
import Link from "next/link";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { gruvboxDark as ColourScheme } from "react-syntax-highlighter/dist/esm/styles/prism";




const mdHighlighter = (Tag: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "strong") =>
		  ({ node, ...props }: React.ComponentProps<"h1"> & { node?: unknown }) => (
					 <Tag { ...props } style={ { ...ColourScheme.keyword, margin: "1.2em 0 0.5em", ...props.style } }/>
		  );


export default function CoursePage({ params }: { params: Promise<{ crs: string }> }) {
	  const { crs } = use(params);
	  const course = COURSES[crs as CrsKey];
	  
	  
	  if (  /*NOT->*/ ! course) return <Alert severity={ "warning" }>{ "Course not found." }</Alert>;
	  
	  return <Stack spacing={ 3 }>
			 <Box>
					<Typography variant={ "h3" } sx={ { fontWeight: 800, mb: 1 } }>{ "Subjects" }</Typography>
					<Typography color={ "text.secondary" }>{ "Select a subject to view its available study material and downloads." }</Typography>
			 </Box>
			 { Object.entries(course.subs).map(([ sem, subjects ]) => subjects.length > 0 && (
						<Box key={ sem } sx={ { mb: 4 } }>
							  <Typography variant={ "h5" } sx={ { mb: 2 } }>
									 { "Semester " + sem }
							  </Typography>
							  <Grid container spacing={ 2 }>
									 { subjects.map((sub) =>
												<SubjectCard key={ sub } sub={ sub }/>
									 ) }
							  </Grid>
						</Box>
			 )) }
	  </Stack>;
}
