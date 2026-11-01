import { api } from "@/firebase/FirebaseApp";
import { NextResponse } from "next/server";




export const buildNextResponse = <T>(obj: T) => NextResponse.json(obj);
export const somethingWentWrong = <T>(obj: Omit<T, keyof ApiStatus>) => buildNextResponse<T>({ ...obj, ...{ status: "FAILURE", message: "Something went wrong" } as ApiStatus } as T);
export const errorOccurred = <T>(error: any, obj: Omit<T, keyof ApiStatus>) => buildNextResponse<T>({ ...obj, ...{ status: "ERROR", message: (error?.message || error?.toString() || "Some error occurred") } as ApiStatus } as T);
export const successResponse = <T>(obj: Omit<T, keyof Pick<ApiStatus, "status">>) => buildNextResponse<T>({ ...obj, ...{ status: "SUCCESS" } as ApiStatus } as T);


export type Status = "SUCCESS" | "FAILURE" | "ERROR";
export type ApiStatus = { status: Status, message: string }

const verifyBgcId = "verify-bgc-id";

export const bridgeBgcId = (bgcId: string): Promise<{ email: string } & ApiStatus> => {
	  if ( /*NOT->*/ ! bgcId) return;
	  return api.post(verifyBgcId, { bgcId }).then(response => response.data);
};

const uploadFiles = "upload-files";

export const bridgeUploadFiles = (files: File[]): Promise<{ url: string, title: string }[] & ApiStatus> => {
	  const formData = new FormData();
	  files.forEach(file => formData.append("files", file, file.name));
	  return api.post(uploadFiles, formData).then(response => response.data);
};


