import { AssetType, pathJoiner } from "@/app/AthenaeumMaster";
import { errorOccurred, successResponse, AthAssetUploadResult } from "@/firebase/Bridge";
import { invokeServerApp } from "@/firebase/FirebaseApp";
import { uploadBytes } from "@firebase/storage";
import { NextRequest } from "next/server";




export async function POST(request: NextRequest) {
	  try {
			 const formData = await request.formData();
			 
			 const files = formData.getAll("files") as File[];
			 const { uid, createStorageRef } = await invokeServerApp(request);
			 if ( /*NOT->*/ ! uid) return errorOccurred("UnauthorisedBuilder", []);
			 const results: AthAssetUploadResult[] = (await Promise.all(files.map(async file => {
					const path = pathJoiner("download" as AssetType, file.name);
					await uploadBytes(createStorageRef(path), file);
					return { title: file.name, url: path };
			 }))).filter(Boolean).filter(r => r.url && r.title);
			 return successResponse({ results });
	  } catch (error) {
			 return errorOccurred(error, { results: null });
	  }
}
