import { ApiGatewayGiveth, ApiGatewayTaketh, GatewayEntry, GatewayQuery } from "@/app/api/gateway/gateway";
import { errorOccurred, somethingWentWrong, successResponse } from "@/firebase/Bridge";
import { invokeServerApp } from "@/firebase/FirebaseApp";
import { child, update } from "@firebase/database";
import { LocalDateTime } from "@js-joda/core";
import { push } from "firebase/database";
import { NextRequest } from "next/server";




export async function POST(req: NextRequest) {
	  try {
			 const body = await req.json() as ApiGatewayTaketh;
			 const { token, category, payload } = body;
			 
			 if (/*NOT->*/ ! token || /*NOT->*/ ! category || /*NOT->*/ ! payload) {
					return errorOccurred<ApiGatewayGiveth>("Invalid request payload.", {});
			 }
			 
			 // 1. Verify Cloudflare Turnstile Token via Dedicated Route
			 // Note: Native fetch is used here per Next.js best practices for Route Handlers,
			 // ensuring compatibility with Edge Runtime and native request caching/memoisation.
			 const origin = req.nextUrl.origin;
			 const verifyRes = await fetch(`${ origin }/api/turnstile`, {
					method: "POST",
					body: JSON.stringify({ token })
			 });
			 const verifyData = await verifyRes.json();
			 
			 if (/*NOT->*/ ! verifyData || verifyData.status !== "SUCCESS") {
					return errorOccurred<ApiGatewayGiveth>(verifyData?.message || "Verification failed.", {});
			 }
			 
			 // 2. Initialize Firebase Server App
			 const firebase = await invokeServerApp(req);
			 if (/*NOT->*/ ! firebase) {
					return somethingWentWrong<ApiGatewayGiveth>({});
			 }
			 
			 const { enquiriesNodeRef } = firebase;
			 
			 const entry = (() => {
					switch (category) {
						  case "query":
								 return {
										...payload,
										timestamp: LocalDateTime.now().toString(),
										source: "apxdgtl" /* this is the secret key */
								 } as GatewayEntry<GatewayQuery>;
					}
			 })();
			 
			 // 3. Atomic RTDB Submission (Inbox Pattern)
			 // No 1MB limit check needed here as RTDB nodes handles large JSON trees.
			 await update(push(enquiriesNodeRef), entry);
			 
			 return successResponse<ApiGatewayGiveth>({ message: "Request submitted successfully." });
			 
	  } catch (e) {
			 return errorOccurred<ApiGatewayGiveth>(e, {});
	  }
}



