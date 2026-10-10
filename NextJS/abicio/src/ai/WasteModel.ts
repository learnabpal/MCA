import * as ort from 'onnxruntime-web';
import { WASTE_CLASSES } from './WasteTypes';

export const WASTE_MODEL_CONFIG = { modelUrl: '/models/WasteDetector.onnx', maxInputSide: 640, stride: 32, confidenceThreshold: 0.25, iouThreshold: 0.45, maxDetections: 100, classCount: WASTE_CLASSES.length } as const;

let wasteSessionPromise: Promise<ort.InferenceSession> | null = null;

export const loadWasteModel = (): Promise<ort.InferenceSession> => {
    if (typeof window === 'undefined') return Promise.reject(new Error('WasteVision inference must run in the browser.'));
    if (wasteSessionPromise !== null) return wasteSessionPromise;
    const supportsWebGPU = typeof navigator !== 'undefined' && Reflect.get(navigator, 'gpu') !== undefined;
    const createSession = (useWebGPU: boolean): Promise<ort.InferenceSession> => ort.InferenceSession.create(WASTE_MODEL_CONFIG.modelUrl, { executionProviders: useWebGPU ? ['webgpu', 'wasm'] : ['wasm'], graphOptimizationLevel: 'all' });
    wasteSessionPromise = createSession(supportsWebGPU).then((session) => session, (initialError: unknown) => {
        if (supportsWebGPU === false) {
            wasteSessionPromise = null;
            return Promise.reject(new Error(`Could not load Abicio's ONNX model. Check that ${WASTE_MODEL_CONFIG.modelUrl} exists and is valid. ${String(initialError)}`));
        }
        return createSession(false).then((session) => session, (fallbackError: unknown) => {
            wasteSessionPromise = null;
            return Promise.reject(new Error(`Abicio could not load its ONNX model with WebGPU or WASM. Check the model file and ONNX Runtime assets. ${String(fallbackError)}`));
        });
    });
    return wasteSessionPromise;
};
