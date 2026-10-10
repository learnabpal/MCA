"use client";
import { detectWaste } from "@/ai/WasteDetector";
import { WASTE_COLOURS, WASTE_GUIDANCE, WasteDetection, WasteHistoryRecord } from "@/ai/WasteMaster";
import { HISTORY_KEY, MAX_IMAGE_BYTES } from "@/app/(public)/layout";
import AddPhotoAlternateOutlined from "@mui/icons-material/AddPhotoAlternateOutlined";
import CameraAltOutlined from "@mui/icons-material/CameraAltOutlined";
import DeleteOutlineOutlined from "@mui/icons-material/DeleteOutlineOutlined";
import ImageSearchOutlined from "@mui/icons-material/ImageSearchOutlined";
import RecyclingOutlined from "@mui/icons-material/RecyclingOutlined";
import { Alert, Box, Button, Card, CardContent, Chip, Divider, LinearProgress, Paper, Stack, Typography } from "@mui/material";
import { alpha, useTheme } from "@mui/material/styles";
import React from "react";




export default function AnalysePage() {
	  const theme = useTheme();
	  const fileInputRef = React.useRef<HTMLInputElement>(null);
	  const cameraInputRef = React.useRef<HTMLInputElement>(null);
	  const [ selectedFile, setSelectedFile ] = React.useState<File | null>(null);
	  const [ previewUrl, setPreviewUrl ] = React.useState("");
	  const [ detections, setDetections ] = React.useState<WasteDetection[]>([]);
	  const [ imageDimensions, setImageDimensions ] = React.useState<{ width: number; height: number } | null>(null);
	  const [ status, setStatus ] = React.useState<"idle" | "running" | "complete">("idle");
	  const [ errorMessage, setErrorMessage ] = React.useState("");
	  const [ dragging, setDragging ] = React.useState(false);
	  
	  React.useEffect(() => {
			 if (selectedFile === null) {
					setPreviewUrl("");
					return;
			 }
			 const objectUrl = URL.createObjectURL(selectedFile);
			 setPreviewUrl(objectUrl);
			 return () => URL.revokeObjectURL(objectUrl);
	  }, [ selectedFile ]);
	  
	  const acceptFile = (file: File | undefined) => {
			 if (file === undefined) return;
			 if (file.type.startsWith("image/") === false) {
					setErrorMessage("Choose an image file such as JPEG, PNG or WebP.");
					return;
			 }
			 if (file.size > MAX_IMAGE_BYTES) {
					setErrorMessage("Choose an image smaller than 15 MB.");
					return;
			 }
			 setSelectedFile(file);
			 setDetections([]);
			 setImageDimensions(null);
			 setStatus("idle");
			 setErrorMessage("");
	  };
	  
	  const analyseImage = () => {
			 if (selectedFile === null || previewUrl.length === 0 || status === "running") return;
			 setStatus("running");
			 setErrorMessage("");
			 const image = new window.Image();
			 image.onload = () => {
					setImageDimensions({ width: image.naturalWidth, height: image.naturalHeight });
					detectWaste(image).then((result) => {
						  setDetections(result);
						  setStatus("complete");
						  const record: WasteHistoryRecord = { id: `${ Date.now() }-${ Math.random().toString(36).slice(2, 8) }`, analysedAt: new Date().toISOString(), fileName: selectedFile.name, detections: result.map((item) => ({ label: item.label, confidence: item.confidence })) };
						  try {
								 const existing = JSON.parse(window.localStorage.getItem(HISTORY_KEY) ?? "[]") as WasteHistoryRecord[];
								 const history = Array.isArray(existing) ? existing : [];
								 window.localStorage.setItem(HISTORY_KEY, JSON.stringify([ record, ...history ].slice(0, 50)));
						  } catch (storageError) {
								 console.warn("Abicio could not save analysis history.", storageError);
						  }
					}, (inferenceError: unknown) => {
						  setStatus("idle");
						  setErrorMessage(inferenceError instanceof Error ? inferenceError.message : "The waste model could not analyse this image.");
					});
			 };
			 image.onerror = () => {
					setStatus("idle");
					setErrorMessage("The selected image could not be decoded by this browser.");
			 };
			 image.src = previewUrl;
	  };
	  
	  const clearImage = () => {
			 setSelectedFile(null);
			 setDetections([]);
			 setImageDimensions(null);
			 setStatus("idle");
			 setErrorMessage("");
			 if (fileInputRef.current !== null) fileInputRef.current.value = "";
			 if (cameraInputRef.current !== null) cameraInputRef.current.value = "";
	  };
	  
	  return <Stack spacing={ 3 }>
			 <Box>
					<Typography variant={ "overline" } color={ "success.main" } sx={ { fontWeight: 900, letterSpacing: "0.12em" } }>{ "WASTE ANALYSIS" }</Typography>
					<Typography variant={ "h2" } sx={ { mt: 0.5 } }>{ "Analyse a photograph" }</Typography>
					<Typography color={ "text.secondary" } sx={ { mt: 1, maxWidth: 760, lineHeight: 1.7 } }>{ "Upload a photograph of one or more waste items. Abicio runs its detector in your browser and displays its predictions with practical handling guidance." }</Typography>
			 </Box>
			 <input
						ref={ fileInputRef } type={ "file" } accept={ "image/*" } hidden={ true }
						onChange={ (event) => {
							  acceptFile(event.target.files?.[0]);
							  event.target.value = "";
						} }
			 />
			 <input
						ref={ cameraInputRef } type={ "file" } accept={ "image/*" } capture={ "environment" } hidden={ true }
						onChange={ (event) => {
							  acceptFile(event.target.files?.[0]);
							  event.target.value = "";
						} }
			 />
			 <Paper variant={ "outlined" }
					  onDragEnter={ (event) => {
							 event.preventDefault();
							 setDragging(true);
					  } }
					  onDragOver={ (event) => {
							 event.preventDefault();
							 setDragging(true);
					  } }
					  onDragLeave={ (event) => {
							 event.preventDefault();
							 setDragging(false);
					  } }
					  onDrop={ (event) => {
							 event.preventDefault();
							 setDragging(false);
							 acceptFile(event.dataTransfer.files?.[0]);
					  } }
					  sx={ { p: { xs: 2, sm: 3 }, borderStyle: "dashed", borderWidth: 2, borderColor: dragging ? "success.main" : "divider", bgcolor: dragging ? alpha(theme.palette.success.main, 0.08) : "background.paper", transition: "border-color 160ms ease, background-color 160ms ease" } }
			 >
					<Stack spacing={ 2 } alignItems={ "center" } sx={ { py: { xs: 2, sm: 3 }, textAlign: "center" } }>
						  <Box sx={ { display: "grid", placeItems: "center", width: 64, height: 64, borderRadius: 3, bgcolor: "rgba(76,175,80,0.14)", color: "success.main" } }>
								 <AddPhotoAlternateOutlined sx={ { fontSize: 34 } }/>
						  </Box>
						  <Box>
								 <Typography variant={ "h5" }>{ "Drop an image here" }</Typography>
								 <Typography color={ "text.secondary" } sx={ { mt: 0.5 } }>{ "JPEG, PNG or WebP · Maximum 15 MB" }</Typography>
						  </Box>
						  <Stack direction={ { xs: "column", sm: "row" } } spacing={ 1.5 }>
								 <Button startIcon={ <AddPhotoAlternateOutlined/> } onClick={ () => fileInputRef.current?.click() }>{ "Choose Image" }</Button>
								 <Button variant={ "outlined" } color={ "secondary" } startIcon={ <CameraAltOutlined/> } onClick={ () => cameraInputRef.current?.click() }>{ "Use Camera" }</Button>
						  </Stack>
					</Stack>
			 </Paper>
			 { errorMessage.length > 0 && <Alert severity={ "error" } onClose={ () => setErrorMessage("") }>
					{ errorMessage }
			 </Alert> }
			 { selectedFile !== null && previewUrl.length > 0 && <Card>
					<CardContent sx={ { p: { xs: 2, sm: 3 } } }>
						  <Stack spacing={ 2.5 }>
								 <Stack direction={ { xs: "column", sm: "row" } } justifyContent={ "space-between" } alignItems={ { xs: "flex-start", sm: "center" } } spacing={ 1 }>
										<Box sx={ { minWidth: 0 } }>
											  <Typography variant={ "h6" } sx={ { overflowWrap: "anywhere" } }>{ selectedFile.name }</Typography>
											  <Typography variant={ "body2" } color={ "text.secondary" }>
													 { (selectedFile.size / (1024 * 1024)).toFixed(2) } MB{ imageDimensions === null ? "" : ` · ${ imageDimensions.width } × ${ imageDimensions.height }px` }
											  </Typography>
										</Box>
										<Button variant={ "text" } color={ "inherit" } startIcon={ <DeleteOutlineOutlined/> } onClick={ clearImage }>Remove</Button>
								 </Stack>
								 <Box sx={ { position: "relative", width: "100%", maxWidth: 1000, mx: "auto", overflow: "hidden", borderRadius: 2, bgcolor: "action.hover" } }>
										<Box component={ "img" } src={ previewUrl } alt={ "Selected waste for analysis" } sx={ { display: "block", width: "100%", height: "auto" } }/>
										{ imageDimensions !== null && detections.length > 0 &&
												  <svg viewBox={ `0 0 ${ imageDimensions.width } ${ imageDimensions.height }` } preserveAspectRatio="none"
														 style={ { position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none" } }
												  >
														 { detections.map((item, index) => {
																		  const label = `${ item.label } ${ Math.round(item.confidence * 100) }%`;
																		  const labelWidth = Math.min(imageDimensions.width - item.box.x1, Math.max(100, label.length * imageDimensions.width * 0.009));
																		  const labelHeight = Math.max(24, imageDimensions.height * 0.035);
																		  return <g key={ `${ item.classId }-${ index }` }>
																				 <rect
																							x={ item.box.x1 } y={ item.box.y1 }
																							width={ item.box.x2 - item.box.x1 } height={ item.box.y2 - item.box.y1 }
																							fill={ alpha(theme.palette.success.main, 0.08) }
																							stroke={ theme.palette.success.main } strokeWidth={ Math.max(2, imageDimensions.width * 0.003) }
																				 />
																				 <rect
																							x={ item.box.x1 } y={ Math.max(0, item.box.y1 - labelHeight) }
																							width={ labelWidth } height={ labelHeight }
																							fill={ theme.palette.success.dark }
																				 />
																				 <text
																							x={ item.box.x1 + labelHeight * 0.2 } y={ Math.max(labelHeight * 0.7, item.box.y1 - labelHeight * 0.25) }
																							fill={ theme.palette.getContrastText(theme.palette.success.dark) }
																							fontSize={ Math.max(12, imageDimensions.width * 0.018) } fontWeight={ 700 }>{ label }</text>
																		  </g>;
																	}
														 ) }
												  </svg>
										}
								 </Box>
								 { status === "running" &&
											<Box>
												  <LinearProgress color={ "success" }/>
												  <Typography variant={ "body2" } color={ "text.secondary" } sx={ { mt: 1 } }>{ "Loading the browser model and analysing detections…" }</Typography>
											</Box>
								 }
								 <Stack direction={ { xs: "column", sm: "row" } } spacing={ 1.5 }>
										<Button onClick={ analyseImage } disabled={ status === "running" } startIcon={ <ImageSearchOutlined/> } size={ "large" }>
											  { status === "running" ? "Analysing…" : status === "complete" ? "Analyse Again" : "Analyse Waste" }
										</Button>
										<Button variant={ "outlined" } color={ "inherit" } onClick={ clearImage }>{ "Clear Image" }
										</Button>
								 </Stack>
						  </Stack>
					</CardContent>
			 </Card>
			 }
			 { status === "complete" &&
						<Box>
							  <Stack direction={ { xs: "column", sm: "row" } } justifyContent={ "space-between" } alignItems={ { xs: "flex-start", sm: "center" } } spacing={ 1 } sx={ { mb: 2 } }>
									 <Box>
											<Typography variant={ "h4" }>{ "Detection Results" }</Typography>
											<Typography color={ "text.secondary" }>{ detections.length } { "detected item" }{ detections.length === 1 ? "" : "s" } { "above the confidence threshold." }</Typography>
									 </Box>
									 <Chip color={ detections.length > 0 ? "success" : "default" } label={ detections.length > 0 ? `${ detections.length } detection${ detections.length === 1 ? "" : "s" }` : "No detections" }/>
							  </Stack>
							  { detections.length === 0 ?
										 <Alert severity={ "info" }>{ "No items passed the model's confidence threshold. Try a clearer photograph with the waste more visible." }</Alert>
										 :
										 <Stack spacing={ 2 }>
												{ detections.map((item, index) => {
													  const guidance = WASTE_GUIDANCE[item.label];
													  const categoryColour = WASTE_COLOURS[guidance.category];
													  return <Card key={ `${ item.classId }-${ index }` }>
															 <CardContent sx={ { p: 2.5 } }>
																	<Stack spacing={ 1.5 }>
																		  <Stack direction={ { xs: "column", sm: "row" } } alignItems={ { xs: "flex-start", sm: "center" } } justifyContent={ "space-between" } spacing={ 1 }>
																				 <Stack direction={ "row" } spacing={ 1 } alignItems={ "center" } flexWrap={ "wrap" }>
																						<Typography variant={ "h6" } sx={ { textTransform: "capitalize" } }>{ item.label.replaceAll("-", " ") }</Typography>
																						<Chip size={ "small" } color={ categoryColour } label={ guidance.category }/>
																				 </Stack>
																				 <Chip variant={ "outlined" } label={ `${ Math.round(item.confidence * 100) }% confidence` }/>
																		  </Stack>
																		  <Divider/>
																		  <Typography variant={ "subtitle1" }>{ guidance.destination }</Typography>
																		  <Typography color={ "text.secondary" }>{ guidance.action }</Typography>
																		  <Alert severity={ guidance.category === "Hazardous" ? "warning" : "info" } icon={ <RecyclingOutlined/> }>
																				 { guidance.caution }</Alert></Stack></CardContent></Card>;
												}) }
										 </Stack>
							  }
							  <Typography variant={ "caption" } color={ "text.secondary" } sx={ { display: "block", mt: 2 } }>
									 { "Confidence scores are model outputs, not guaranteed probabilities. Guidance is general and does not replace local waste-management rules." }
							  </Typography>
						</Box> }
	  </Stack>;
}
