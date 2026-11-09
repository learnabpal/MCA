"use client";

import { Heading } from "@/app/(public)/layout";
import { ArrowForwardRoundedIcon, BGC_HEX_M, BGC_HEX_O, NAV_ITEMS, UI_TEXTS } from "@/app/AthenaeumMaster";
import { getCourseSets, SPCL_MAP } from "@/app/BgcMaster";
import { Box, Card, CardActionArea, CardContent, Grid, Stack, Typography } from "@mui/material";
import Link from "next/link";




export default function CoursesPage() {
	  return <Stack spacing={ 3 }>
			 <Heading title={ "Courses" } subtitle={ UI_TEXTS.courses }/>
			 { getCourseSets().map(([ alpha, courses ]) =>
						<Box key={ alpha } sx={ { mb: 4 } }>
							  <Typography variant={ "h5" } sx={ { mb: 2 } }>
									 { alpha }
							  </Typography>
							  <Grid container spacing={ 2 }>
									 { Object.entries(courses).map(([ crs, { titles, spcl } ]) =>
												<Grid item xs={ 12 } sm={ 6 } md={ 4 } key={ crs }>
													  <Card variant={ "outlined" } sx={ { height: "100%", bgcolor: BGC_HEX_M } }>
															 <CardActionArea component={ Link } href={ `${ NAV_ITEMS.courses.href }/${ crs }` } sx={ { height: "100%" } }>
																	<CardContent sx={ { p: 2.5 } }>
																		  <Stack direction={ "row" } alignItems={ "center" } spacing={ 2 } justifyContent={ "space-between" } color={ BGC_HEX_O }>
																				 <Typography variant={ "h6" }>{ titles.full }</Typography>
																				 {/* <Typography variant={ "h6" }>{ titles.abbr }</Typography> */ }
																				 <ArrowForwardRoundedIcon fontSize={ "small" } color={ "inherit" }/>
																		  </Stack>
																		  <Stack>
																				 { spcl.map(s => <Typography key={ s } variant={ "subtitle2" }>{ SPCL_MAP[s] }</Typography>) }
																		  </Stack>
																	
																	</CardContent>
															 </CardActionArea>
													  </Card>
												</Grid>
									 ) as any }
							  </Grid>
						</Box>
			 ) as any }
	  </Stack>;
}
