"use client";
import { APP_NAME, EcoOutlined, FEATURES } from "@/app/AbicioMaster";
import ArrowForwardRounded from "@mui/icons-material/ArrowForwardRounded";
import BiotechOutlined from "@mui/icons-material/BiotechOutlined";
import SpaOutlined from "@mui/icons-material/SpaOutlined";
import { Box, Button, Card, CardContent, Chip, Grid, Stack, Typography } from "@mui/material";
import Link from "next/link";




export default function HomePage() {
	  return <Stack spacing={ { xs: 4, md: 6 } }>
			 <Box sx={ { position: "relative", overflow: "hidden", p: { xs: 3, sm: 5, md: 7 }, borderRadius: 5, border: 1, borderColor: "divider", background: "radial-gradient(circle at 88% 12%, rgba(129,199,132,0.18), transparent 36%), linear-gradient(135deg, rgba(76,175,80,0.12), rgba(0,150,136,0.05))" } }>
					<Stack spacing={ 3 } sx={ { position: "relative", zIndex: 1, maxWidth: 760 } }>
						  <Chip
									 icon={ <EcoOutlined/> } label={ "AI-ASSISTED WASTE INTELLIGENCE" } color={ "success" } variant={ "outlined" }
									 sx={ { p: 1, alignSelf: "flex-start", fontWeight: 800, letterSpacing: "0.04em" } }
						  />
						  <Typography variant={ "h1" } sx={ { fontSize: { xs: 36, sm: 48, md: 60 }, lineHeight: 1.05 } }>
								 { "Make better decisions about " }
								 <Box component={ "span" } sx={ { color: "success.main" } }>
										{ "every piece of waste." }
								 </Box>
						  </Typography>
						  <Typography variant={ "h6" } color={ "text.secondary" } sx={ { fontWeight: 400, maxWidth: 640, lineHeight: 1.7 } }>
								 { APP_NAME + " analyses a waste photograph, identifies visible items and offers practical next steps for segregation, reuse, recycling and responsible disposal." }
						  </Typography>
						  <Stack direction={ { xs: "column", sm: "row" } } spacing={ 1.5 }>
								 <Button component={ Link } href={ "/analyse" } size={ "large" } endIcon={ <ArrowForwardRounded/> }>{ "Analyse Waste" }</Button>
								 <Button component={ Link } href={ "/history" } size={ "large" } variant={ "outlined" } color={ "inherit" }>{ "View History" }</Button>
						  </Stack>
						  <Typography variant={ "caption" } color={ "text.secondary" }>
								 { "Predictions are estimates. Confirm local collection and recycling requirements before disposal." }
						  </Typography>
					</Stack>
					<Box
							  sx={ {
									 display: { xs: "none", md: "grid" }, placeItems: "center",
									 position: "absolute", right: 42, top: "50%", transform: "translateY(-50%)",
									 width: 210, height: 210,
									 borderRadius: "50%", border: 1, borderColor: "success.main", color: "success.main", bgcolor: "action.hover"
							  } }
					>
						  <SpaOutlined sx={ { fontSize: 112 } }/>
					</Box>
			 </Box>
			 <Box>
					<Stack spacing={ 1 } sx={ { mb: 2.5 } }>
						  <Typography variant={ "overline" } color={ "success.main" } sx={ { fontWeight: 900, letterSpacing: "0.12em" } }>{ "THE WORKFLOW" }</Typography>
						  <Typography variant={ "h3" }>{ "From photograph to action" }</Typography>
						  <Typography color={ "text.secondary" } sx={ { maxWidth: 720 } }>
								 { "Computer vision identifies what may be present; a separate rule-based layer turns those labels into understandable guidance." }
						  </Typography>
					</Stack>
					<Grid container spacing={ 2 }>
						  { FEATURES.map((feature, index) =>
									 <Grid key={ feature.title } size={ { xs: 12, md: 4 } }>
											<Card sx={ { height: "100%" } }><CardContent sx={ { p: 3 } }>
												  <Stack spacing={ 2 }>
														 <Box sx={ { display: "grid", placeItems: "center", width: 48, height: 48, borderRadius: 2, bgcolor: `${ feature.colour }.dark`, color: "common.white" } }>
																{ feature.icon }
														 </Box>
														 <Typography variant={ "h5" }>{ `${ String(index + 1).padStart(2, "0") } · ${ feature.title }` }</Typography>
														 <Typography color={ "text.secondary" } sx={ { lineHeight: 1.75 } }>{ feature.description }</Typography>
												  </Stack>
											</CardContent>
											</Card>
									 </Grid>
						  ) }
					</Grid>
			 </Box>
			 <Card>
					<CardContent sx={ { p: { xs: 2.5, md: 3.5 } } }>
						  <Stack direction={ { xs: "column", md: "row" } } spacing={ 2 } alignItems={ { xs: "flex-start", md: "center" } }>
								 <Box sx={ { display: "grid", placeItems: "center", width: 52, height: 52, borderRadius: 2, bgcolor: "rgba(0,150,136,0.14)", color: "secondary.main", flexShrink: 0 } }>
										<BiotechOutlined sx={ { fontSize: 30 } }/>
								 </Box>
								 <Box sx={ { flex: 1 } }>
										<Typography variant={ "h5" }>{ "Browser - based AI inference" }</Typography>
										<Typography color={ "text.secondary" } sx={ { mt: 0.5 } }>{ "The waste detector runs in the browser with ONNX Runtime Web. Photos do not need to be uploaded to a separate Python inference server." }</Typography>
								 </Box>
								 <Button component={ Link } href={ "/analyse" } endIcon={ <ArrowForwardRounded/> } sx={ { flexShrink: 0 } }>{ "Try " + APP_NAME }</Button>
						  </Stack>
					</CardContent>
			 </Card>
	  </Stack>;
}
