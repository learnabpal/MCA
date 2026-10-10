export const WASTE_CLASSES = ['battery', 'biological', 'brown-glass', 'cardboard', 'clothes', 'green-glass', 'metal', 'paper', 'plastic', 'shoes', 'trash', 'white-glass'] as const;

export type WasteClass = typeof WASTE_CLASSES[number];
export type WasteBox = { x1: number; y1: number; x2: number; y2: number };
export type WasteDetection = { classId: number; label: WasteClass; confidence: number; box: WasteBox };
export type WasteCategory = 'Hazardous' | 'Organic' | 'Glass' | 'Dry Recyclables' | 'Textiles' | 'Residual';
export type WasteGuidance = { category: WasteCategory; destination: string; action: string; caution: string };

export type WasteHistoryRecord = { id: string; analysedAt: string; fileName: string; detections: Array<{ label: WasteClass; confidence: number }> };
