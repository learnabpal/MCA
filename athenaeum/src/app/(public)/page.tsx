"use client";

import { APP_NAME, BGC_HEX, NAV_ITEMS } from "@/app/AthenaeumMaster";
import ArrowForwardRounded from "@mui/icons-material/ArrowForwardRounded";
import GitHub from "@mui/icons-material/GitHub";
import MenuBookOutlined from "@mui/icons-material/MenuBookOutlined";
import { Box, Card, CardActionArea, CardContent, Grid, Stack, Typography } from "@mui/material";
import Link from "next/link";




export default function HomePage() {
	  return <Stack spacing={ { xs: 4, md: 5 } }>
			 <Box sx={ { position: "relative", overflow: "hidden", p: { xs: 3, sm: 5, md: 7 }, borderRadius: 4, border: 1, borderColor: "divider", background: `radial-gradient(ellipse at top right, ${ BGC_HEX }99 0%, #000000 50%)`, color: "#ffffff", minHeight: { xs: 300, md: 360 }, display: "flex", alignItems: "center" } }>
					<Stack spacing={ 2.5 } maxWidth={ "md" } sx={ { position: "relative", zIndex: 1 } }>
						  <Typography variant={ "overline" } sx={ { fontWeight: 800, letterSpacing: "0.16em", color: "rgba(255,255,255,0.72)" } }>{ APP_NAME }</Typography>
						  <Typography variant={ "h1" } sx={ { fontSize: { xs: 36, sm: 48, md: 60 }, lineHeight: 1.1, letterSpacing: "-0.035em" } }>
								 { "Your MCA studies, organised in one place." }
						  </Typography>
						  <Typography variant={ "h6" } sx={ { lineHeight: 1.8, color: "rgba(255,255,255,0.78)", maxWidth: 680 } }>
								 { "Explore subject-wise study material, read individual topics, access subject-level downloads, and find the source code for the MCA monorepo." }
						  </Typography>
					</Stack>
			 </Box>
			 <Box>
					<Typography variant={ "h5" } sx={ { mb: 1 } }>{ "Explore " + APP_NAME }</Typography>
					<Typography color={ "text.secondary" } sx={ { mb: 3 } }>{ "Choose where you want to begin." }</Typography>
					<Grid container spacing={ 2 }>
						  { Object.entries(NAV_ITEMS).filter(([ key ]) => key !== "home").map(([ key, item ]) => (
									 <Grid key={ key } size={ { xs: 12, sm: 6 } } sx={ { flexGrow: 1 } }>
											<Card variant={ "outlined" } sx={ { height: "100%", bgcolor: "background.paper", transition: "border-color 180ms ease", "&:hover": { borderColor: "primary.main" } } }>
												  <CardActionArea component={ Link } href={ item.href } sx={ { height: "100%" } }>
														 <CardContent sx={ { p: { xs: 2.5, md: 3 }, minHeight: 155 } }>
																<Stack direction={ "row" } alignItems={ "flex-start" } justifyContent={ "space-between" } spacing={ 2 }>
																	  <Box sx={ { display: "grid", placeItems: "center", width: 46, height: 46, borderRadius: 2, bgcolor: "action.hover", flexShrink: 0 } }>
																			 { item.icon }
																	  </Box>
																	  <ArrowForwardRounded sx={ { mt: 1, color: "text.secondary" } }/>
																</Stack>
																<Typography variant={ "h6" } sx={ { mt: 2 } }>{ item.label }</Typography>
																<Typography variant={ "body2" } color={ "text.secondary" } sx={ { mt: 0.75, lineHeight: 1.7 } }>{ item.desc }</Typography>
														 </CardContent>
												  </CardActionArea>
											</Card>
									 </Grid>
						  )) }
					</Grid>
			 </Box>
	  </Stack>;
}
