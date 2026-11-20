import { AthAsset, download } from "@/app/AthenaeumMaster";
import { SubKey } from "@/app/BgcMaster";
import { errorOccurred, successResponse } from "@/firebase/Bridge";
import { invokeServerApp } from "@/firebase/FirebaseApp";
import { child, get } from "@firebase/database";
import { NextRequest } from "next/server";




export async function GET(request: NextRequest, { params }: { params: Promise<{ sub: SubKey; id: string }> }) {
	  try {
			 const { sub, id } = await params;
			 if ( /*NOT->*/ ! sub || /*NOT->*/ ! id) throw "NoParams";
			 const { subjectNodeRef } = await invokeServerApp(request);
			 const snapshot = await get(child(subjectNodeRef(sub, download), id));
			 if ( /*NOT->*/ ! snapshot.exists()) throw "NotFound";
			 
			 const asset = snapshot.val() as AthAsset;
			 return successResponse({ asset });
	  } catch (error) {
			 return errorOccurred(error, { asset: null });
	  }
}
