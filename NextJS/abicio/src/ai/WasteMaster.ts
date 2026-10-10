import { blueGrey, green, lightBlue, orange, purple, teal } from "@mui/material/colors";




export const WASTE_CLASSES = [ "battery", "biological", "brown-glass", "cardboard", "clothes", "green-glass", "metal", "paper", "plastic", "shoes", "trash", "white-glass" ] as const;
export const WASTE_CATEGORIES = [ "Hazardous", "Organic", "Glass", "Dry Recyclables", "Textiles", "Residual" ] as const;
export const WASTE_COLOURS: Record<WasteCategory, string> = {
	  Hazardous: orange[400],
	  Organic: green[400],
	  Glass: lightBlue[300],
	  "Dry Recyclables": teal[300],
	  Textiles: purple[300],
	  Residual: blueGrey[300]
};

export type WasteClass = typeof WASTE_CLASSES[number];
export type WasteBox = { x1: number; y1: number; x2: number; y2: number };
export type WasteDetection = { classId: number; label: WasteClass; confidence: number; box: WasteBox };
export type WasteCategory = typeof WASTE_CATEGORIES[number];
export type WasteGuidance = { category: WasteCategory; destination: string; action: string; caution: string };

export type WasteHistoryRecord = { id: string; analysedAt: string; fileName: string; detections: Array<{ label: WasteClass; confidence: number }> };


export const WASTE_GUIDANCE: Record<WasteClass, WasteGuidance> = {
	  battery: { category: "Hazardous", destination: "Battery collection point", action: "Keep the battery separate and take it to an authorised battery collection point.", caution: "Do not place it in mixed household waste or attempt to dismantle it." },
	  biological: { category: "Organic", destination: "Wet or organic waste stream", action: "Separate it as organic waste where your local collection service accepts it.", caution: "The model label does not establish whether the material is food waste, garden waste or infectious biological waste." },
	  "brown-glass": { category: "Glass", destination: "Glass collection stream", action: "Keep it separate and check whether your local collection service accepts brown glass.", caution: "Handle broken glass carefully and prevent injury." },
	  cardboard: { category: "Dry Recyclables", destination: "Paper and cardboard collection", action: "Keep it clean and dry, then place it in a collection stream that accepts cardboard.", caution: "Food- or oil-contaminated cardboard may not be accepted for recycling." },
	  clothes: { category: "Textiles", destination: "Reuse or textile collection", action: "Reuse, repair or donate wearable clothing; otherwise look for a textile collection route.", caution: "Do not assume every textile collection accepts damaged or contaminated clothing." },
	  "green-glass": { category: "Glass", destination: "Glass collection stream", action: "Keep it separate and check whether your local collection service accepts green glass.", caution: "Handle broken glass carefully and prevent injury." },
	  metal: { category: "Dry Recyclables", destination: "Metal collection stream", action: "Keep it separate and confirm that the local service accepts this metal item.", caution: "Sharp edges can cause injury; the model does not identify every alloy or coating." },
	  paper: { category: "Dry Recyclables", destination: "Paper collection", action: "Keep it clean and dry, then place it in a collection stream that accepts paper.", caution: "Wet, laminated, waxed or food-contaminated paper may not be recyclable locally." },
	  plastic: { category: "Dry Recyclables", destination: "Plastic collection stream", action: "Keep it separate and check whether your local service accepts this item and plastic type.", caution: "The detected class does not identify the resin code or prove that the item is recyclable." },
	  shoes: { category: "Textiles", destination: "Reuse or footwear collection", action: "Repair, reuse or donate wearable shoes; otherwise look for a footwear or textile collection route.", caution: "Do not place them in textile recycling unless the service accepts footwear." },
	  trash: { category: "Residual", destination: "Residual waste stream", action: "Check whether the item can be reused or separated into a locally accepted recycling stream before disposal.", caution: "This broad class does not identify the item's material or prove that it cannot be recovered." },
	  "white-glass": { category: "Glass", destination: "Glass collection stream", action: "Keep it separate and check whether your local collection service accepts clear glass.", caution: "Handle broken glass carefully and prevent injury." }
};
