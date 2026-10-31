import { buildNextResponse, errorOccurred, successResponse } from "@/firebase/Bridge";
import { invokeServerApp } from "@/firebase/FirebaseApp";
import { child, get } from "@firebase/database";
import { NextRequest } from "next/server";




export async function POST(request: NextRequest) {
	  const json = await request.json();
	  
	  const { bgcIdsNodeRef } = await invokeServerApp(request);
	  
	  const snapshot = await get(child(bgcIdsNodeRef, String(json.bgcId)));
	  if (snapshot.exists() && snapshot.val() === true) return successResponse(true);
	  return errorOccurred("Invalid BGC ID", false);
}
