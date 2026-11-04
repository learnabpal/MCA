"use client";

import { SubjectCard } from "@/app/(public)/subjects/page";
import { BGC_HEX_O, COURSES, CrsKey, SPCL_MAP, UI_TEXTS } from "@/app/AthenaeumMaster";
import { Alert, Box, Grid, Stack, Typography } from "@mui/material";
import React, { use } from "react";
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
					<Typography variant={ "h3" } color={ BGC_HEX_O } sx={ { fontWeight: 800, mb: 1 } }>{ course.titles.abbr }</Typography>
					<Typography color={ "text.secondary" }>{ UI_TEXTS.subject }</Typography>
			 </Box>
			 { Object.entries(course.subs).map(([ sem, subject_map ]) => Object.keys(subject_map).length > 0 &&
						<Box key={ sem } sx={ { mb: 4 } }>
							  <Typography variant={ "h4" } sx={ { mb: 2 } }>
									 { "Semester " + sem }
							  </Typography>
							  { Object.entries(subject_map).map(([ spcl, subjects ]) => subjects.length > 0 &&
										 <Stack key={ spcl } sx={ { borderLeft: 1, pl: 2, borderColor: BGC_HEX_O } }>
												<Typography variant={ "h6" } sx={ { mb: 2 } }>
													  { SPCL_MAP[spcl] }
												</Typography>
												<Grid container spacing={ 2 } px={ 2 }>
													  { subjects.map((sub) => <SubjectCard key={ sub } sub={ sub }/>) }
												</Grid>
										 </Stack>
							  ) }
						</Box>
			 ) }
	  </Stack>;
}
