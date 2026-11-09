import { AssetType, AthBuilderMeta, AthAsset, BgcId } from "@/app/AthenaeumMaster";
import { api } from "@/firebase/FirebaseApp";
import { AxiosResponse } from "axios";
import { NextResponse } from "next/server";




export const buildNextResponse = <T>(obj: T) => NextResponse.json(obj);
export const somethingWentWrong = <T>(obj: Omit<T, keyof ApiStatus>) => buildNextResponse<T>({ ...obj, ...{ status: "FAILURE", message: "Something went wrong" } as ApiStatus } as T);
export const errorOccurred = <T>(error: any, obj: Omit<T, keyof ApiStatus>) => buildNextResponse<T>({ ...obj, ...{ status: "ERROR", message: (error?.message || error?.toString() || "Some error occurred") } as ApiStatus } as T);
export const successResponse = <T>(obj: Omit<T, keyof Pick<ApiStatus, "status">>) => buildNextResponse<T>({ ...obj, ...{ status: "SUCCESS" } as ApiStatus } as T);


export type Status = "SUCCESS" | "FAILURE" | "ERROR";
export type ApiStatus = { status: Status, message: string }

const onboarding = (bgcId: string) => `onboarding/${ bgcId }`;
export const bridgeOnboarding = (bgcId: string): Promise<AxiosResponse<BgcId & { obStatus: boolean | string } & ApiStatus>> => {
	  if ( /*NOT->*/ ! bgcId) return;
	  return api.post(onboarding(bgcId), { bgcId });
};

export const bridgeOnboardingBuilderMetaPOST = (meta: AthBuilderMeta): Promise<AxiosResponse<ApiStatus>> => {
	  if ( /*NOT->*/ ! meta.bgcId || /*NOT->*/ ! meta.crs ||  /*NOT->*/ ! meta.email) return;
	  return api.post(onboarding("builder"), meta);
};
export const bridgeOnboardingBuilderMetaGET = (): Promise<AxiosResponse<AthBuilderMeta & ApiStatus>> => {
	  return api.get(onboarding("builder"));
};


const uploadFiles = "upload-files";
export const bridgeUploadFiles = (files: File[]): Promise<AxiosResponse<{ results: { url: string, title: string }[] } & ApiStatus>> => {
	  const formData = new FormData();
	  files.forEach(file => formData.append("files", file));
	  return api.post(uploadFiles, formData);
};

const pushAsset = "push-asset";

export const bridgePushAsset = (aType: AssetType, asset: AthAsset[]): Promise<AxiosResponse<ApiStatus>> => {

};


