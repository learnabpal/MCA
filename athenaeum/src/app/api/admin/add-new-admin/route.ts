import { aobj } from "@/app/api/admin/check-admin/route";
import { BgcId } from "@/app/AthenaeumMaster";
import { errorOccurred } from "@/firebase/Bridge";
import { invokeServerApp } from "@/firebase/FirebaseApp";
import { child, get, update } from "@firebase/database";
import { NextRequest } from "next/server";




export async function POST(request: NextRequest) {
	  try {
			 const { bgcId } = await request.json() as BgcId;
			 if ( /*NOT->*/ ! bgcId) throw "AddNewAdminInvalidBGCId";
			 const { uid, email, adminNodeRef, bgcIdNodeRef } = await invokeServerApp(request);
			 if ( /*NOT->*/ ! uid) throw "AddNewAdminNotAuthenticated";
			 const { valid } = await aobj(adminNodeRef, email);
			 if ( /*NOT->*/ ! valid) throw "AddNewAdminAdminEmailNotAllowed";
			 const snapshot = await get(child(bgcIdNodeRef, bgcId));
			 const onboarded = typeof snapshot.val() === "string";
			 if (onboarded) throw "AddNewAdminBGCIdAlreadyOnboarded";
			 await update(bgcIdNodeRef, { [bgcId]: true });
	  } catch (error) {
			 errorOccurred(error, null);
	  }
}
