import { AthBuilderMeta } from "@/app/AthenaeumMaster";
import { errorOccurred, successResponse } from "@/firebase/Bridge";
import { invokeServerApp } from "@/firebase/FirebaseApp";
import { child, get, set, update } from "@firebase/database";
import { NextRequest } from "next/server";




export async function POST(request: NextRequest) {
	  try {
			 const meta = await request.json() as AthBuilderMeta;
			 if ( /*NOT->*/ ! meta.bgcId || /*NOT->*/ ! meta.crs || /*NOT->*/ ! meta.email) throw "OnboardingSetupNoData";
			 const { builderMetaNodeRef, uid, bgcIdNodeRef } = await invokeServerApp(request);
			 if ( /*NOT->*/ ! uid) throw "OnboardingBuilderNotAuthenticated";
			 await update(child(builderMetaNodeRef, uid), meta);
			 await set(child(bgcIdNodeRef, meta.bgcId), `${ meta.crs }|${ meta.email }`);
			 return successResponse({});
	  } catch (error) {
			 return errorOccurred(error, null);
	  }
	  
}

export async function GET(request: NextRequest) {
	  try {
			 const { builderMetaNodeRef, uid } = await invokeServerApp(request);
			 if ( /*NOT->*/ ! uid) throw "OnboardingBuilderNotAuthenticated";
			 const snapshot = await get(child(builderMetaNodeRef, uid));
			 if (snapshot.exists()) {
					const meta = snapshot.val() as AthBuilderMeta;
					return successResponse(meta);
			 }
			 throw "OnboardingBuilderNoData";
	  } catch (error) {
			 return errorOccurred(error, null);
	  }
}
