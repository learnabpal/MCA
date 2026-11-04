"use client";

import { ArrowForwardRoundedIcon, getCourseSets, NAV_ITEMS, opacity, SPCL_MAP } from "@/app/AthenaeumMaster";
import { Box, Card, CardActionArea, CardContent, Grid, Stack, Typography } from "@mui/material";
import Link from "next/link";




export default function SubjectsPage() {
	  return <Stack spacing={ 3 }>
			 <Box>
					<Typography variant={ "h3" } sx={ { fontWeight: 800, mb: 1 } }>{ "Courses" }</Typography>
					<Typography color={ "text.secondary" }>{ "Select a course to view its available subjects." }</Typography>
			 </Box>
			 { getCourseSets().map(([ alpha, courses ]) =>
						<Box key={ alpha } sx={ { mb: 4 } }>
							  <Typography variant={ "h5" } sx={ { mb: 2 } }>
									 { alpha }
							  </Typography>
							  <Grid container spacing={ 2 }>
									 { Object.entries(courses).map(([ crs, { titles, spcl } ]) => <Grid item xs={ 12 } sm={ 6 } md={ 4 } key={ crs }>
											<Card variant={ "outlined" } sx={ { height: "100%", bgcolor: "background.paper" } }>
												  <CardActionArea component={ Link } href={ `${ NAV_ITEMS.courses.href }/${ crs }` } sx={ { height: "100%" } }>
														 <CardContent sx={ { p: 2.5 } }>
																<Stack direction={ "row" } alignItems={ "center" } spacing={ 2 } justifyContent={ "space-between" }>
																	  <Typography variant={ "h6" }>{ titles.full }</Typography>
																	  {/* <Typography variant={ "h6" }>{ titles.abbr }</Typography> */ }
																	  <ArrowForwardRoundedIcon fontSize={ "small" } color={ "action" }/>
																</Stack>
																<Stack sx={ { opacity } }>
																	  { spcl.map(s => <Typography key={ s } variant={ "subtitle2" }>{ SPCL_MAP[s] }</Typography>) }
																</Stack>
														 
														 </CardContent>
												  </CardActionArea>
											</Card>
									 </Grid>) }
							  </Grid>
						</Box>
			 ) }
	  </Stack>;
}
