"use client";

import { Heading } from "@/app/(public)/layout";
import { ArrowForwardRoundedIcon, BGC_HEX_M, BGC_HEX_O, NAV_ITEMS, UI_TEXTS } from "@/app/AthenaeumMaster";
import { getSubjectSets, SUB_MAP } from "@/app/BgcMaster";
import { Box, Card, CardActionArea, CardContent, Grid, Stack, Typography } from "@mui/material";
import Link from "next/link";




export default function SubjectsPage() {
	  return <Stack spacing={ 3 }>
			 <Heading title={ "Subjects" } subtitle={ UI_TEXTS.subjects }/>
			 { getSubjectSets().map(([ alpha, subjects ]) =>
						<Box key={ alpha } sx={ { mb: 4 } }>
							  <Typography variant={ "h5" } sx={ { mb: 2 } }>
									 { alpha }
							  </Typography>
							  <Grid container spacing={ 2 }>
									 { Object.entries(subjects).map(([ sub, title ]) => <SubjectCard key={ sub } sub={ sub }/>) }
							  </Grid>
						</Box>
			 ) }
	  </Stack>;
}

export function SubjectCard({ sub, title }: { sub: string }) {
	  return <Grid item xs={ 12 } sm={ 6 } md={ 4 }>
			 <Card variant={ "outlined" } sx={ { height: "100%", bgcolor: BGC_HEX_M } }>
					<CardActionArea component={ Link } href={ `${ NAV_ITEMS.subjects.href }/${ sub }` } sx={ { height: "100%" } }>
						  <CardContent sx={ { p: 2.5 } }>
								 <Stack direction={ "row" } alignItems={ "center" } spacing={ 2 } justifyContent={ "space-between" } color={ BGC_HEX_O }>
										<Typography variant={ "h6" }>{ SUB_MAP[sub] }</Typography>
										<ArrowForwardRoundedIcon fontSize={ "small" } color={ "inherit" }/>
								 </Stack>
						  </CardContent>
					</CardActionArea>
			 </Card>
	  </Grid>;
}
