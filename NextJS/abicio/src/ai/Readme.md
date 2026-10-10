# Abicio AI/ML Files

This package contains four consolidated TypeScript files for browser-side waste detection and disposal guidance.

## Files

- `src/ai/WasteTypes.ts` — class labels and shared types.
- `src/ai/WasteModel.ts` — model settings and cached ONNX Runtime session with WebGPU/WASM fallback.
- `src/ai/WasteDetector.ts` — aspect-ratio-aware preprocessing for arbitrary source image dimensions, ONNX inference, YOLO output decoding, box-coordinate restoration and class-aware non-maximum suppression.
- `src/ai/WasteRules.ts` — transparent rule-based guidance for the model's 12 labels.

## Integration

Install the runtime in the existing Next.js project:

```bash
npm install onnxruntime-web
```

Place the converted model at:

`public/models/WasteDetector.onnx`

The model itself is not included in this archive: generate it in Google Colab from the published `.pt` checkpoint. The TypeScript detector expects a standard Ultralytics YOLO detection ONNX output with shape `[1, 4 + 12, N]` or its transposed form `[1, N, 4 + 12]`. The 12 class names and their order follow the model card for `kendrickfff/waste-classification-yolov8-ken`.

## Usage

Call `detectWaste(imageElement)` from a client-side component, where `imageElement` is a loaded `HTMLImageElement`, `HTMLCanvasElement` or `ImageBitmap`:

```typescript
import { detectWaste } from '@/ai/WasteDetector';
import { WASTE_GUIDANCE } from '@/ai/WasteRules';

detectWaste(imageElement).then((detections) => {
    detections.forEach((detection) => {
        console.log(detection.label, detection.confidence, detection.box, WASTE_GUIDANCE[detection.label]);
    });
}, (error: unknown) => {
    console.error('Abicio waste detection failed:', error);
});
```

The source image can have any valid dimensions. With a dynamic-shape ONNX export, preprocessing scales it proportionally and uses a model tensor whose dimensions are rounded to the model stride, rather than requiring a 640 × 640 uploaded image. The configured `maxInputSide` is an inference-resolution setting, not an upload restriction.

## Model, licence and limitations

Model candidate: [Kendrick's Waste Classification YOLOv8](https://huggingface.co/kendrickfff/waste-classification-yolov8-ken), checkpoint `yolov8n-waste-12cls-best.pt`. The repository declares **CC BY 4.0**; retain attribution and review the licence terms when distributing Abicio.

The repository model card reports 12 classes, but it does not publish detailed independent evaluation metrics. Validate model accuracy and class-index order against representative test images before relying on the predictions. Detection confidence is not a probability guarantee. The rules are general guidance, not location-specific municipal rules; local collection acceptance must be confirmed.

## Important export requirement

Export the checkpoint to ONNX with dynamic spatial input dimensions using Ultralytics in Google Colab. The app code uses letterboxing and output decoding that match the standard raw YOLO detection output. If you export with embedded NMS or another output format, this decoder must be changed to match that export.
