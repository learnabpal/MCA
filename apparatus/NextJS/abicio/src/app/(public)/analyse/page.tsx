"use client";
import { detectWaste } from "@/ai/WasteDetector";
import { WASTE_COLOURS, WASTE_GUIDANCE, WasteDetection, WasteHistoryRecord } from "@/ai/WasteMaster";
import { APP_NAME, HISTORY_KEY, MAX_IMAGE_BYTES, RecyclingOutlined } from "@/app/AbicioMaster";
import AddPhotoAlternateOutlined from "@mui/icons-material/AddPhotoAlternateOutlined";
import CameraAltOutlined from "@mui/icons-material/CameraAltOutlined";
import DeleteOutlineOutlined from "@mui/icons-material/DeleteOutlineOutlined";
import ImageSearchOutlined from "@mui/icons-material/ImageSearchOutlined";
import { Alert, Box, Button, Card, CardContent, Chip, Divider, LinearProgress, Paper, Stack, Typography } from "@mui/material";
import { alpha, useTheme } from "@mui/material/styles";
import React from "react";




type SelectedWasteImage = {
	  id: string;
	  file: File;
	  previewUrl: string;
	  detections: WasteDetection[];
	  dimensions: { width: number; height: number } | null;
	  status: "idle" | "running" | "complete" | "error";
	  errorMessage: string;
};


export default function AnalysePage() {
	  const theme = useTheme();
	  const fileInputRef = React.useRef<HTMLInputElement>(null);
	  const cameraInputRef = React.useRef<HTMLInputElement>(null);
	  const [ selectedImages, setSelectedImages ] = React.useState<SelectedWasteImage[]>([]);
	  const objectUrlsRef = React.useRef<Set<string>>(new Set());
	  React.useEffect(() => {
			 return () => {
					objectUrlsRef.current.forEach((url) => URL.revokeObjectURL(url));
					objectUrlsRef.current.clear();
			 };
	  }, []);
	  const [ errorMessage, setErrorMessage ] = React.useState("");
	  const [ dragging, setDragging ] = React.useState(false);
	  
	  const acceptFiles = (files: File[] | FileList | undefined) => {
			 if (files === undefined || files.length === 0) return;
			 const accepted: SelectedWasteImage[] = [];
			 const errors: string[] = [];
			 Array.from(files).forEach((file) => {
					if (file.type.startsWith("image/") === false) {
						  errors.push(`${ file.name }: choose an image file such as JPEG, PNG or WebP.`);
						  return;
					}
					if (file.size > MAX_IMAGE_BYTES) {
						  errors.push(`${ file.name }: image exceeds the 15 MB limit.`);
						  return;
					}
					const previewUrl = URL.createObjectURL(file);
					objectUrlsRef.current.add(previewUrl);
					accepted.push({
						  id: `${ Date.now() }-${ Math.random().toString(36).slice(2, 9) }`,
						  file,
						  previewUrl,
						  detections: [],
						  dimensions: null,
						  status: "idle",
						  errorMessage: ""
					});
			 });
			 if (accepted.length > 0) {
					setSelectedImages((current) => [ ...current, ...accepted ]);
			 }
			 setErrorMessage(errors.join(" "));
	  };
	  
	  const analyseImages = () => {
			 if (selectedImages.length === 0 || selectedImages.some((item) => item.status === "running")) return;
			 const imagesToAnalyse = selectedImages;
			 setErrorMessage("");
			 setSelectedImages((current) => current.map((item) => ({
					...item,
					detections: [],
					dimensions: null,
					status: "running",
					errorMessage: ""
			 })));
			 imagesToAnalyse.forEach((selectedImage) => {
					const image = new window.Image();
					image.onload = () => {
						  setSelectedImages((current) => current.map((item) => item.id === selectedImage.id
									 ? { ...item, dimensions: { width: image.naturalWidth, height: image.naturalHeight } }
									 : item
						  ));
						  detectWaste(image).then((result) => {
								 setSelectedImages((current) => current.map((item) => item.id === selectedImage.id
											? { ...item, detections: result, status: "complete", errorMessage: "" }
											: item
								 ));
								 const record: WasteHistoryRecord = {
										id: `${ Date.now() }-${ Math.random().toString(36).slice(2, 8) }`,
										analysedAt: new Date().toISOString(),
										fileName: selectedImage.file.name,
										detections: result.map((item) => ({ label: item.label, confidence: item.confidence }))
								 };
								 try {
										const existing = JSON.parse(window.localStorage.getItem(HISTORY_KEY) ?? "[]") as WasteHistoryRecord[];
										const history = Array.isArray(existing) ? existing : [];
										window.localStorage.setItem(HISTORY_KEY, JSON.stringify([ record, ...history ].slice(0, 50)));
								 } catch (storageError) {
										console.warn(APP_NAME + " could not save analysis history.", storageError);
								 }
						  }, (inferenceError: unknown) => {
								 setSelectedImages((current) => current.map((item) => item.id === selectedImage.id
											? {
												  ...item,
												  status: "error",
												  errorMessage: inferenceError instanceof Error
															 ? inferenceError.message
															 : "The waste model could not analyse this image."
											}
											: item
								 ));
						  });
					};
					image.onerror = () => {
						  setSelectedImages((current) => current.map((item) => item.id === selectedImage.id
									 ? { ...item, status: "error", errorMessage: "The selected image could not be decoded by this browser." }
									 : item
						  ));
					};
					image.src = selectedImage.previewUrl;
			 });
	  };
	  
	  const removeImage = (imageId: string) => {
			 const selectedImage = selectedImages.find((item) => item.id === imageId);
			 if (selectedImage === undefined || selectedImage.status === "running") return;
			 URL.revokeObjectURL(selectedImage.previewUrl);
			 objectUrlsRef.current.delete(selectedImage.previewUrl);
			 setSelectedImages((current) => current.filter((item) => item.id !== imageId));
	  };
	  
	  const clearImages = () => {
			 if (selectedImages.some((item) => item.status === "running")) return;
			 selectedImages.forEach((item) => {
					URL.revokeObjectURL(item.previewUrl);
					objectUrlsRef.current.delete(item.previewUrl);
			 });
			 setSelectedImages([]);
			 setErrorMessage("");
			 if (fileInputRef.current !== null) fileInputRef.current.value = "";
			 if (cameraInputRef.current !== null) cameraInputRef.current.value = "";
	  };
	  
	  return <Stack spacing={ 3 }>
			 <Box>
					<Typography variant={ "overline" } color={ "success.main" } sx={ { fontWeight: 900, letterSpacing: "0.12em" } }>{ "WASTE ANALYSIS" }</Typography>
					<Typography variant={ "h2" } sx={ { mt: 0.5 } }>{ "Analyse photographs" }</Typography>
					<Typography color={ "text.secondary" } sx={ { mt: 1, maxWidth: 760, lineHeight: 1.7 } }>
						  { "Upload a photograph of one or more waste items. " }{ APP_NAME }{ " runs its detector in your browser and displays its predictions with practical handling guidance." }
					</Typography>
			 </Box>
			 <input
						ref={ fileInputRef }
						type={ "file" } accept={ "image/*" } multiple hidden
						onChange={ (event) => {
							  acceptFiles(event.target.files ? Array.from(event.target.files) : undefined);
							  event.target.value = "";
						} }
			 />
			 <input
						ref={ cameraInputRef }
						type={ "file" } accept={ "image/*" } multiple hidden
						capture={ "environment" }
						onChange={ (event) => {
							  acceptFiles(event.target.files ? Array.from(event.target.files) : undefined);
							  event.target.value = "";
						} }
			 />
			 <Paper
						variant={ "outlined" }
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
							  acceptFiles(Array.from(event.dataTransfer.files));
						} }
						sx={ {
							  p: { xs: 2, sm: 3 }, borderStyle: "dashed", borderWidth: 2, borderColor: dragging ? "success.main" : "divider",
							  bgcolor: dragging ? alpha(theme.palette.success.main, 0.08) : "background.paper", transition: "border-color 160ms ease, background-color 160ms ease"
						} }
			 >
					<Stack spacing={ 2 } alignItems={ "center" } sx={ { py: { xs: 2, sm: 3 }, textAlign: "center" } }>
						  <Box sx={ { display: "grid", placeItems: "center", width: 64, height: 64, borderRadius: 3, bgcolor: "rgba(76,175,80,0.14)", color: "success.main" } }>
								 <AddPhotoAlternateOutlined sx={ { fontSize: 34 } }/>
						  </Box>
						  <Box>
								 <Typography variant={ "h5" }>{ "Drop images here" }</Typography>
								 <Typography color={ "text.secondary" } sx={ { mt: 0.5 } }>{ "JPEG, PNG or WebP · Maximum 15 MB" }</Typography>
						  </Box>
						  <Stack direction={ { xs: "column", sm: "row" } } spacing={ 1.5 }>
								 <Button startIcon={ <AddPhotoAlternateOutlined/> } onClick={ () => fileInputRef.current?.click() }>{ "Choose Images" }</Button>
								 <Button variant={ "outlined" } color={ "secondary" } startIcon={ <CameraAltOutlined/> } onClick={ () => cameraInputRef.current?.click() }>{ "Use Camera" }</Button>
						  </Stack>
					</Stack>
			 </Paper>
			 { errorMessage.length > 0 && <Alert severity={ "error" } onClose={ () => setErrorMessage("") }>
					{ errorMessage }
			 </Alert> }
			 { selectedImages.length > 0 && (
						<Stack spacing={ 3 }>
							  <Stack
										 direction={ { xs: "column", sm: "row" } } alignItems={ { xs: "stretch", sm: "center" } } justifyContent={ "space-between" } spacing={ 1.5 }>
									 <Box>
											<Typography variant={ "h4" }>
												  { "Selected Images" }
											</Typography>
											<Typography color={ "text.secondary" }>
												  { selectedImages.length } { "image" }{ selectedImages.length === 1 ? "" : "s" }{ " selected." }
												  { " Each image will be analysed independently." }
											</Typography>
									 </Box>
									 <Stack direction={ { xs: "column", sm: "row" } } spacing={ 1 }>
											<Button startIcon={ <ImageSearchOutlined/> }
													  onClick={ analyseImages }
													  disabled={ selectedImages.some((item) => item.status === "running") }
											>
												  { selectedImages.some((item) => item.status === "running")
															 ? "Analysing Images…"
															 : selectedImages.every((item) => item.status === "complete")
																		? "Analyse All Again"
																		: "Analyse All Images" }
											</Button>
											<Button
													  variant={ "outlined" } color={ "inherit" } startIcon={ <DeleteOutlineOutlined/> }
													  onClick={ clearImages }
													  disabled={ selectedImages.some((item) => item.status === "running") }
											>
												  { "Clear All" }
											</Button>
									 </Stack>
							  </Stack>
							  
							  { selectedImages.map((selectedImage) => (
										 <Card key={ selectedImage.id }>
												<CardContent sx={ { p: { xs: 2, sm: 3 } } }>
													  <Stack spacing={ 2.5 }>
															 <Stack direction={ { xs: "column", sm: "row" } } alignItems={ { xs: "flex-start", sm: "center" } } justifyContent={ "space-between" } spacing={ 1 }>
																	<Box sx={ { minWidth: 0 } }>
																		  <Typography variant={ "h6" } sx={ { overflowWrap: "anywhere" } }>{ selectedImage.file.name }</Typography>
																		  <Typography variant={ "body2" } color={ "text.secondary" }>
																				 { (selectedImage.file.size / (1024 * 1024)).toFixed(2) }{ " MB" }
																				 { selectedImage.dimensions === null
																							? ""
																							: ` · ${ selectedImage.dimensions.width } × ${ selectedImage.dimensions.height }px` }
																		  </Typography>
																	</Box>
																	<Stack direction={ "row" } alignItems={ "center" } spacing={ 1 }>
																		  <Chip
																					 size={ "small" }
																					 color={
																							selectedImage.status === "complete" ? "success" :
																									  selectedImage.status === "running" ? "info" :
																												 selectedImage.status === "error" ? "error" : "default"
																					 }
																					 label={
																							selectedImage.status === "complete" ? "Analysed" :
																									  selectedImage.status === "running" ? "Analysing" :
																												 selectedImage.status === "error" ? "Failed" : "Pending"
																					 }
																		  />
																		  <Button variant={ "text" } color={ "inherit" } startIcon={ <DeleteOutlineOutlined/> }
																					 disabled={ selectedImage.status === "running" }
																					 onClick={ () => removeImage(selectedImage.id) }
																		  >
																				 { "Remove" }
																		  </Button>
																	</Stack>
															 </Stack>
															 
															 <Box sx={ { position: "relative", width: "100%", maxWidth: 1000, mx: "auto", overflow: "hidden", borderRadius: 2, bgcolor: "action.hover" } }>
																	<Box
																			  component={ "img" }
																			  src={ selectedImage.previewUrl }
																			  alt={ `Waste image: ${ selectedImage.file.name }` }
																			  sx={ { display: "block", width: "100%", height: "auto" } }
																	/>
																	{ selectedImage.dimensions !== null && selectedImage.detections.length > 0 && (
																			  <svg
																						 viewBox={ `0 0 ${ selectedImage.dimensions.width } ${ selectedImage.dimensions.height }` }
																						 preserveAspectRatio="none"
																						 style={ { position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none" } }
																			  >
																					 { selectedImage.detections.map((item, index) => {
																							const dimensions = selectedImage.dimensions!;
																							const label = `${ item.label } ${ Math.round(item.confidence * 100) }%`;
																							const labelWidth = Math.min(
																									  dimensions.width - item.box.x1,
																									  Math.max(100, label.length * dimensions.width * 0.009)
																							);
																							const labelHeight = Math.max(24, dimensions.height * 0.035);
																							return (
																									  <g key={ `${ item.classId }-${ index }` }>
																											 <rect
																														x={ item.box.x1 } y={ item.box.y1 }
																														width={ item.box.x2 - item.box.x1 } height={ item.box.y2 - item.box.y1 }
																														fill={ alpha(theme.palette.success.main, 0.08) }
																														stroke={ theme.palette.success.main }
																														strokeWidth={ Math.max(2, dimensions.width * 0.003) }
																											 />
																											 <rect
																														x={ item.box.x1 } y={ Math.max(0, item.box.y1 - labelHeight) }
																														width={ labelWidth } height={ labelHeight }
																														fill={ theme.palette.success.dark }
																											 />
																											 <text
																														x={ item.box.x1 + labelHeight * 0.2 } y={ Math.max(labelHeight * 0.7, item.box.y1 - labelHeight * 0.25) }
																														fill={ theme.palette.getContrastText(theme.palette.success.dark) }
																														fontSize={ Math.max(12, dimensions.width * 0.018) }
																														fontWeight={ 700 }
																											 >
																													{ label }
																											 </text>
																									  </g>
																							);
																					 }) }
																			  </svg>
																	) }
															 </Box>
															 
															 { selectedImage.status === "running" && (
																		<Box>
																			  <LinearProgress color={ "success" }/>
																			  <Typography variant={ "body2" } color={ "text.secondary" } sx={ { mt: 1 } }>
																					 { "Loading the browser model and analysing this image…" }
																			  </Typography>
																		</Box>
															 ) }
															 
															 { selectedImage.status === "error" && <Alert severity={ "error" }>{ selectedImage.errorMessage }</Alert> }
															 
															 { selectedImage.status === "complete" && (
																		<Box>
																			  <Stack direction={ { xs: "column", sm: "row" } } alignItems={ { xs: "flex-start", sm: "center" } } justifyContent={ "space-between" } spacing={ 1 } sx={ { mb: 2 } }>
																					 <Box>
																							<Typography variant={ "h5" }>{ "Detection Results" }</Typography>
																							<Typography color={ "text.secondary" }>
																								  { selectedImage.detections.length }{ " detected item" }
																								  { selectedImage.detections.length === 1 ? "" : "s" }.
																							</Typography>
																					 </Box>
																					 <Chip
																								color={ selectedImage.detections.length > 0 ? "success" : "default" }
																								label={
																									  selectedImage.detections.length > 0
																												 ? `${ selectedImage.detections.length } detection${ selectedImage.detections.length === 1 ? "" : "s" }`
																												 : "No detections"
																								}
																					 />
																			  </Stack>
																			  
																			  { selectedImage.detections.length === 0 ? (
																						 <Alert severity={ "info" }>
																								{ "No items passed the model's confidence threshold. Try a clearer photograph with the waste more visible." }
																						 </Alert>
																			  ) : (
																						 <Stack spacing={ 2 }>
																								{ selectedImage.detections.map((item, index) => {
																									  const { category, destination, action, caution } = WASTE_GUIDANCE[item.label];
																									  const categoryColour = WASTE_COLOURS[category];
																									  return (
																												 <Card key={ `${ item.classId }-${ index }` }>
																														<CardContent sx={ { p: 2.5 } }>
																															  <Stack spacing={ 1.5 }>
																																	 <Stack direction={ { xs: "column", sm: "row" } } alignItems={ { xs: "flex-start", sm: "center" } } justifyContent={ "space-between" } spacing={ 1 }>
																																			<Stack direction={ "row" } spacing={ 1 } alignItems={ "center" } flexWrap={ "wrap" }>
																																				  <Typography variant={ "h6" } sx={ { textTransform: "capitalize" } }>
																																						 { item.label.replaceAll("-", " ") }
																																				  </Typography>
																																				  <Chip size={ "small" } color={ categoryColour } label={ category }/>
																																			</Stack>
																																			<Chip variant={ "outlined" } label={ `${ Math.round(item.confidence * 100) }% confidence` }/>
																																	 </Stack>
																																	 <Divider/>
																																	 <Typography variant={ "subtitle1" }>{ destination }</Typography>
																																	 <Typography color={ "text.secondary" }>{ action }</Typography>
																																	 <Alert severity={ category === "Hazardous" ? "warning" : "info" } icon={ <RecyclingOutlined/> }>
																																			{ caution }
																																	 </Alert>
																															  </Stack>
																														</CardContent>
																												 </Card>
																									  );
																								}) }
																						 </Stack>
																			  ) }
																			  <Typography variant={ "caption" } color={ "text.secondary" } sx={ { display: "block", mt: 2 } }>
																					 { "Confidence scores are model outputs, not guaranteed probabilities. Guidance is general and does not replace local waste-management rules." }
																			  </Typography>
																		</Box>
															 ) }
													  </Stack>
												</CardContent>
										 </Card>
							  )) }
						</Stack>
			 ) }
	  </Stack>;
}
