import { NextResponse } from "next/server";




export const buildNextResponse = <T>(obj: T) => NextResponse.json(obj);
export const somethingWentWrong = <T>(obj: Omit<T, keyof ApiStatus>) => buildNextResponse<T>({ ...obj, ...{ status: "FAILURE", message: "Something went wrong" } as ApiStatus } as T);
export const errorOccurred = <T>(error: any, obj: Omit<T, keyof ApiStatus>) => buildNextResponse<T>({ ...obj, ...{ status: "ERROR", message: (error?.message || error?.toString() || "Some error occurred") } as ApiStatus } as T);
export const successResponse = <T>(obj: Omit<T, keyof Pick<ApiStatus, "status">>) => buildNextResponse<T>({ ...obj, ...{ status: "SUCCESS" } as ApiStatus } as T);


export type Status = "SUCCESS" | "FAILURE" | "ERROR";
export type ApiStatus = { status: Status, message: string }







