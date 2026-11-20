import { AthRtdbMap, subject } from "@/app/AthenaeumMaster";
import { SubKey } from "@/app/BgcMaster";
import { errorOccurred, successResponse } from "@/firebase/Bridge";
import { invokeServerApp } from "@/firebase/FirebaseApp";
import { get } from "@firebase/database";
import { NextRequest } from "next/server";




export async function GET(request: NextRequest, { params }: { params: Promise<{ sub: SubKey }> }) {
	  try {
			 const { sub } = await params;
			 if ( /*NOT->*/ ! sub) throw "NoSubject";
			 const { subjectNodeRef } = await invokeServerApp(request);
			 
			 const snapshot = await get(subjectNodeRef(sub));
			 const data: AthRtdbMap[ typeof subject ][ SubKey ] = (snapshot.exists() ? snapshot.val() : { content: {}, download: {} });
			 
			 return successResponse(data);
	  } catch (error) {
			 return errorOccurred(error, { content: {}, download: {} });
	  }
}
