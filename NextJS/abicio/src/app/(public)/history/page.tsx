"use client";
import { WasteHistoryRecord } from "@/ai/WasteMaster";
import { formatTimestamp, HISTORY_KEY } from "@/app/(public)/layout";
import DeleteSweepOutlined from "@mui/icons-material/DeleteSweepOutlined";
import HistoryOutlined from "@mui/icons-material/HistoryOutlined";
import { Alert, Box, Button, Card, CardContent, Chip, Stack, Typography } from "@mui/material";
import Link from "next/link";
import React from "react";




export default function HistoryPage() {
	  const [ records, setRecords ] = React.useState<WasteHistoryRecord[]>([]);
	  const [ loaded, setLoaded ] = React.useState(false);
	  React.useEffect(() => {
			 try {
					const parsed = JSON.parse(window.localStorage.getItem(HISTORY_KEY) ?? "[]") as WasteHistoryRecord[];
					setRecords(Array.isArray(parsed) ? parsed.filter((item) => typeof item?.id === "string" && typeof item?.analysedAt === "string" && Array.isArray(item?.detections)) : []);
			 } catch (error) {
					console.warn("Abicio could not read analysis history.", error);
					setRecords([]);
			 }
			 setLoaded(true);
	  }, []);
	  const clearHistory = () => {
			 try {
					window.localStorage.removeItem(HISTORY_KEY);
					setRecords([]);
			 } catch (error) {
					console.warn("Abicio could not clear analysis history.", error);
			 }
	  };
	  return <Stack spacing={ 3 }>
			 <Box>
					<Typography variant={ "overline" } color={ "success.main" } sx={ { fontWeight: 900, letterSpacing: "0.12em" } }>{ "YOUR ACTIVITY" }</Typography>
					<Typography variant={ "h2" } sx={ { mt: 0.5 } }>Analysis History</Typography><Typography color={ "text.secondary" } sx={ { mt: 1 } }>{ "Recent analyses saved in this browser. History is stored locally on this device and is not synchronised to a server." }</Typography>
			 </Box>
			 { records.length > 0 &&
						<Box sx={ { display: "flex", justifyContent: "flex-end" } }>
							  <Button variant={ "outlined" } color={ "error" } startIcon={ <DeleteSweepOutlined/> } onClick={ clearHistory }>{ "Clear History" }</Button>
						</Box> }
			 { loaded && records.length === 0 ?
						<Card><CardContent sx={ { p: { xs: 3, md: 5 } } }>
							  <Stack spacing={ 2 } alignItems={ "center" } textAlign={ "center" }>
									 <Box sx={ { display: "grid", placeItems: "center", width: 60, height: 60, borderRadius: "50%", bgcolor: "action.hover", color: "success.main" } }>
											<HistoryOutlined sx={ { fontSize: 32 } }/>
									 </Box>
									 <Typography variant={ "h5" }>{ "No analyses yet" }</Typography>
									 <Typography color={ "text.secondary" } sx={ { maxWidth: 440 } }>{ "Your completed image analyses will appear here so you can review the detected waste categories later." }</Typography>
									 <Button component={ Link } href={ "/analyse" }>{ "Analyse Waste" }</Button>
							  </Stack>
						</CardContent>
						</Card>
						:
						<Stack spacing={ 2 }>{ records.map((record) => {
							  const counts = record.detections.reduce<Record<string, number>>((all, item) => ({ ...all, [item.label]: (all[item.label] ?? 0) + 1 }), {});
							  return <Card key={ record.id }>
									 <CardContent sx={ { p: 2.5 } }>
											<Stack spacing={ 1.5 }><Box sx={ { display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 2, flexWrap: "wrap" } }>
												  <Box sx={ { minWidth: 0 } }>
														 <Typography variant={ "h6" } sx={ { overflowWrap: "anywhere" } }>{ record.fileName }</Typography>
														 <Typography variant={ "body2" } color={ "text.secondary" }>{ formatTimestamp(record.analysedAt) }</Typography>
												  </Box>
												  <Chip color={ record.detections.length > 0 ? "success" : "default" } label={ `${ record.detections.length } detection${ record.detections.length === 1 ? "" : "s" }` }/>
											</Box>
												  { record.detections.length === 0 ? <Alert severity={ "info" }>{ "No objects exceeded the confidence threshold." }</Alert>
															 :
															 <Stack direction={ "row" } spacing={ 1 } useFlexGap={ true } flexWrap={ "wrap" }>
																	{ Object.entries(counts).map(([ label, count ]) =>
																			  <Chip key={ label } variant={ "outlined" } label={ `${ label.replaceAll("-", " ") } × ${ count }` }/>
																	) }
															 </Stack>
												  }
											</Stack>
									 </CardContent>
							  </Card>
										 ;
						}) }
						</Stack>
			 }
	  </Stack>;
}
