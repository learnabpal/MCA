import { EntryMode, joiner } from "@/app/AthenaeumMaster";
import { errorOccurred, successResponse } from "@/firebase/Bridge";
import { invokeServerApp } from "@/firebase/FirebaseApp";
import { getDownloadURL, uploadBytes } from "@firebase/storage";
import { NextRequest } from "next/server";




export async function POST(request: NextRequest) {
	  try {
			 const formData = await request.formData();
			 
			 const files = formData.getAll("files") as File[];
			 const { uid, createStorageRef } = await invokeServerApp(request);
			 if ( /*NOT->*/ ! uid) return errorOccurred("UnauthorisedBuilder", []);
			 const results = (await Promise.all(files.map(async file => {
					const snapshot = await uploadBytes(createStorageRef((joiner("download" as EntryMode, file.name))), file);
					const url = await getDownloadURL(snapshot.ref);
					return { title: file.name, url };
			 }))).filter(Boolean).filter(r => r.url && r.title);
			 return successResponse({ results });
	  } catch (error) {
			 return errorOccurred(error, { results: null });
	  }
}
