"use client";

import { ArrowForwardRoundedIcon, BGC_HEX_M, BGC_HEX_O, getCourseSets, NAV_ITEMS, SPCL_MAP, UI_TEXTS } from "@/app/AthenaeumMaster";
import { Box, Card, CardActionArea, CardContent, Grid, Stack, Typography } from "@mui/material";
import Link from "next/link";




export default function SubjectsPage() {
	  return <Stack spacing={ 3 }>
			 <Box>
					<Typography variant={ "h3" } sx={ { mb: 1 } } color={ BGC_HEX_O }>{ "Courses" }</Typography>
					<Typography color={ "text.secondary" }>{ UI_TEXTS.course }</Typography>
			 </Box>
			 { getCourseSets().map(([ alpha, courses ]) =>
						<Box key={ alpha } sx={ { mb: 4 } }>
							  <Typography variant={ "h5" } sx={ { mb: 2 } }>
									 { alpha }
							  </Typography>
							  <Grid container spacing={ 2 }>
									 { Object.entries(courses).map(([ crs, { titles, spcl } ]) => <Grid item xs={ 12 } sm={ 6 } md={ 4 } key={ crs }>
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
									 </Grid>) }
							  </Grid>
						</Box>
			 ) }
	  </Stack>;
}
