import { GET } from "@/app/api/connect-bgc-id/route";
import { errorOccurred, successResponse } from "@/firebase/Bridge";
import { invokeServerApp } from "@/firebase/FirebaseApp";
import { child, get } from "@firebase/database";
import { NextRequest } from "next/server";




export async function POST(request: NextRequest) {
	  try {
			 const { bgcId } = await request.json();
			 if ( /*NOT->*/ ! bgcId) throw "OnboardingNoBgcId";
			 const { bgcIdNodeRef } = await invokeServerApp(request);
			 const snapshot = await get(child(bgcIdNodeRef, bgcId));
			 if (snapshot.exists()) return successResponse({ bgcId, obStatus: snapshot.val() as boolean | string });
			 else throw "OnboardingDisallowedBGCId";
	  } catch (error) {
			 return errorOccurred(error, { bgcId: null, obStatus: null });
	  }
	  
}
