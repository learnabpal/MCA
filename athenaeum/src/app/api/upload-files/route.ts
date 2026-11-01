import { FormMode, joiner } from "@/app/AthenaeumMaster";
import { errorOccurred } from "@/firebase/Bridge";
import { invokeServerApp } from "@/firebase/FirebaseApp";
import { getDownloadURL, uploadBytes } from "@firebase/storage";
import { NextRequest } from "next/server";




export async function POST(request: NextRequest) {
	  try {
			 const formData = await request.formData();
			 
			 const files = formData.getAll("files") as File[];
			 const { createStorageRef } = await invokeServerApp(request);
			 const results = await Promise.all(files.map(async file => {
					const snapshot = await uploadBytes(createStorageRef((joiner("download" as FormMode, file.name))), file);
					const url = await getDownloadURL(snapshot.ref);
					return { title: file.name, url };
			 }));
			 return results;
	  } catch (error) {
			 return errorOccurred(error, []);
	  }
}
