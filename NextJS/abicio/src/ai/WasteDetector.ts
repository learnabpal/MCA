import * as ort from "onnxruntime-web";
import { WASTE_CLASSES, type WasteBox, type WasteClass, type WasteDetection } from "./WasteMaster";
import { loadWasteModel, WASTE_MODEL_CONFIG } from "./WasteModel";




export const detectWaste = (source: HTMLImageElement | HTMLCanvasElement | ImageBitmap): Promise<WasteDetection[]> => {
    if (typeof window === 'undefined') return Promise.reject(new Error('Abicio detection must run in the browser.'));
    return loadWasteModel().then((session) => {
        const sourceWidth = source instanceof HTMLImageElement ? source.naturalWidth : source.width;
        const sourceHeight = source instanceof HTMLImageElement ? source.naturalHeight : source.height;
        if (sourceWidth <= 0 || sourceHeight <= 0) throw new Error('The supplied image has no usable dimensions.');
        const scale = WASTE_MODEL_CONFIG.maxInputSide / Math.max(sourceWidth, sourceHeight);
        const resizedWidth = Math.max(1, Math.round(sourceWidth * scale));
        const resizedHeight = Math.max(1, Math.round(sourceHeight * scale));
        const inputWidth = Math.max(WASTE_MODEL_CONFIG.stride, Math.ceil(resizedWidth / WASTE_MODEL_CONFIG.stride) * WASTE_MODEL_CONFIG.stride);
        const inputHeight = Math.max(WASTE_MODEL_CONFIG.stride, Math.ceil(resizedHeight / WASTE_MODEL_CONFIG.stride) * WASTE_MODEL_CONFIG.stride);
        const padLeft = Math.floor((inputWidth - resizedWidth) / 2);
        const padTop = Math.floor((inputHeight - resizedHeight) / 2);
        const canvas = document.createElement('canvas');
        canvas.width = inputWidth;
        canvas.height = inputHeight;
        const context = canvas.getContext('2d', { willReadFrequently: true });
        if (context === null) throw new Error('The browser could not prepare the image for inference.');
        context.fillStyle = 'rgb(114, 114, 114)';
        context.fillRect(0, 0, inputWidth, inputHeight);
        context.drawImage(source, padLeft, padTop, resizedWidth, resizedHeight);
        const pixels = context.getImageData(0, 0, inputWidth, inputHeight).data;
        const planeSize = inputWidth * inputHeight;
        const inputData = new Float32Array(planeSize * 3);
        for (let pixel = 0; pixel < planeSize; pixel += 1) {
            const rgbaIndex = pixel * 4;
            inputData[pixel] = (pixels[rgbaIndex] ?? 0) / 255;
            inputData[planeSize + pixel] = (pixels[rgbaIndex + 1] ?? 0) / 255;
            inputData[planeSize * 2 + pixel] = (pixels[rgbaIndex + 2] ?? 0) / 255;
        }
        const inputName = session.inputNames[0];
        if (inputName === undefined) throw new Error('The ONNX model has no input tensor.');
        const inputTensor = new ort.Tensor('float32', inputData, [1, 3, inputHeight, inputWidth]);
        const scaleX = resizedWidth / sourceWidth;
        const scaleY = resizedHeight / sourceHeight;
        const clamp = (value: number, min: number, max: number): number => Math.max(min, Math.min(max, value));
        return session.run({ [inputName]: inputTensor }).then((outputs) => {
            const outputName = session.outputNames[0];
            if (outputName === undefined || outputs[outputName] === undefined) throw new Error('The ONNX model did not return a detection tensor.');
            const output = outputs[outputName];
            if (output.dims.length !== 3 || output.dims[0] !== 1) throw new Error(`Unexpected detector output dimensions: ${output.dims.join(' × ')}.`);
            if (output.data instanceof Float32Array === false) throw new Error('The detector output is not a Float32 tensor.');
            const data = output.data as Float32Array;
            const channelCount = 4 + WASTE_CLASSES.length;
            const channelsFirst = output.dims[1] === channelCount;
            const channelsLast = output.dims[2] === channelCount;
            if (channelsFirst === channelsLast) throw new Error(`Unexpected YOLO output layout ${output.dims.join(' × ')}; expected 4 box values plus 12 class scores.`);
            const candidateCount = channelsFirst ? output.dims[2] : output.dims[1];
            const read = (channel: number, candidate: number): number => data[channelsFirst ? channel * candidateCount + candidate : candidate * channelCount + channel] ?? 0;
            const candidates: WasteDetection[] = [];
            for (let candidate = 0; candidate < candidateCount; candidate += 1) {
                let classId = 0;
                let confidence = -1;
                for (let classIndex = 0; classIndex < WASTE_CLASSES.length; classIndex += 1) {
                    const score = read(classIndex + 4, candidate);
                    if (score > confidence) {
                        confidence = score;
                        classId = classIndex;
                    }
                }
                if (confidence < WASTE_MODEL_CONFIG.confidenceThreshold) continue;
                const centreX = read(0, candidate);
                const centreY = read(1, candidate);
                const width = read(2, candidate);
                const height = read(3, candidate);
                const box: WasteBox = {
                    x1: clamp((centreX - width / 2 - padLeft) / scaleX, 0, sourceWidth),
                    y1: clamp((centreY - height / 2 - padTop) / scaleY, 0, sourceHeight),
                    x2: clamp((centreX + width / 2 - padLeft) / scaleX, 0, sourceWidth),
                    y2: clamp((centreY + height / 2 - padTop) / scaleY, 0, sourceHeight)
                };
                if (box.x2 <= box.x1 || box.y2 <= box.y1) continue;
                candidates.push({ classId, label: WASTE_CLASSES[classId] as WasteClass, confidence, box });
            }
            const intersectionOverUnion = (first: WasteBox, second: WasteBox): number => {
                const intersectionWidth = Math.max(0, Math.min(first.x2, second.x2) - Math.max(first.x1, second.x1));
                const intersectionHeight = Math.max(0, Math.min(first.y2, second.y2) - Math.max(first.y1, second.y1));
                const intersectionArea = intersectionWidth * intersectionHeight;
                const firstArea = Math.max(0, first.x2 - first.x1) * Math.max(0, first.y2 - first.y1);
                const secondArea = Math.max(0, second.x2 - second.x1) * Math.max(0, second.y2 - second.y1);
                const unionArea = firstArea + secondArea - intersectionArea;
                return unionArea > 0 ? intersectionArea / unionArea : 0;
            };
            const ranked = candidates.sort((first, second) => second.confidence - first.confidence);
            const selected: WasteDetection[] = [];
            for (const candidate of ranked) {
                let suppressed = false;
                for (const accepted of selected) {
                    if (candidate.classId === accepted.classId && intersectionOverUnion(candidate.box, accepted.box) > WASTE_MODEL_CONFIG.iouThreshold) {
                        suppressed = true;
                        break;
                    }
                }
                if (suppressed === false) selected.push(candidate);
                if (selected.length >= WASTE_MODEL_CONFIG.maxDetections) break;
            }
            return selected;
        });
    });
};
