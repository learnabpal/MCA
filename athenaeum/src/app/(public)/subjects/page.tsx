"use client";

import { NAV_ITEMS, SUB_MAP, SUBS } from "@/app/AthenaeumMaster";
import ArrowForwardRounded from "@mui/icons-material/ArrowForwardRounded";
import { Box, Button, Card, CardActionArea, CardContent, Grid, Stack, Typography } from "@mui/material";
import Link from "next/link";




export default function SubjectsPage() {
	  return <Stack spacing={ 3 }>
			 <Box>
					<Typography variant={ "h3" } sx={ { fontWeight: 800, mb: 1 } }>{ "Subjects" }</Typography>
					<Typography color={ "text.secondary" }>{ "Select a subject to view its available study material and downloads." }</Typography>
			 </Box>
			 { Object.entries(SUBS).map(([ sem, subjects ]) => subjects.length > 0 && (
						<Box key={ sem } sx={ { mb: 4 } }>
							  <Typography variant={ "h5" } sx={ { mb: 2 } }>
									 { "Semester " + sem.replace("sem", "") }
							  </Typography>
							  <Grid container spacing={ 2 }>
									 { subjects.map((sub) => (
												<Grid item xs={ 12 } sm={ 6 } md={ 4 } key={ sub }>
													  <Card variant={ "outlined" } sx={ { height: "100%", bgcolor: "background.paper" } }>
															 <CardActionArea component={ Link } href={ `/subjects/${ sub }` } sx={ { height: "100%" } }>
																	<CardContent sx={ { p: 2.5 } }>
																		  <Stack direction={ "row" } alignItems={ "center" } spacing={ 2 } justifyContent={ "space-between" }>
																				 <Typography variant={ "h6" }>{ SUB_MAP[sub] }</Typography>
																				 <ArrowForwardRounded fontSize={ "small" } color={ "action" }/>
																		  </Stack>
																	</CardContent>
															 </CardActionArea>
													  </Card>
												</Grid>
									 )) }
							  </Grid>
						</Box>
			 )) }
	  </Stack>;
}
