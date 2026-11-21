import { AthRtdbMap, content, download, subject } from "@/app/AthenaeumMaster";
import { SUB_MAP, SubKey } from "@/app/BgcMaster";
import { errorOccurred, successResponse } from "@/firebase/Bridge";
import { invokeServerApp } from "@/firebase/FirebaseApp";
import { get } from "@firebase/database";
import { NextRequest } from "next/server";




export async function GET(request: NextRequest, { params }: { params: Promise<{ sub: SubKey }> }) {
	  try {
			 const { sub } = await params;
			 if ( /*NOT->*/ ! SUB_MAP[sub]) throw "NoSubject";
			 const { createSubjectNodeRef } = await invokeServerApp(request);
			 const snapshots = await Promise.all(
						[
							  get(createSubjectNodeRef(sub, content)),
							  get(createSubjectNodeRef(sub, download))
						]
			 );
			 const data: AthRtdbMap[ typeof subject ][ SubKey ] = {
					content: snapshots[0].exists() ? snapshots[0].val() : {},
					download: snapshots[1].exists() ? snapshots[1].val() : {}
			 };
			 
			 return successResponse(data);
	  } catch (error) {
			 console.log({ error });
			 return errorOccurred(error, { content: {}, download: {} });
	  }
}
