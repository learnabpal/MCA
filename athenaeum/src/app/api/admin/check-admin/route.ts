import { errorOccurred, successResponse } from "@/firebase/Bridge";
import { invokeServerApp } from "@/firebase/FirebaseApp";
import { get } from "@firebase/database";
import { NextRequest } from "next/server";




export const aobj = async (adminNodeRef, email) => {
	  const snapshot = await get(adminNodeRef);
	  const obj: { admins: Record<number, string> } = snapshot.val();
	  const valid = Object.values(obj.admins).includes(email);
	  return { ...obj, valid };
};

export async function GET(request: NextRequest) {
	  try {
			 const { uid, email, adminNodeRef } = await invokeServerApp(request);
			 if ( /*NOT->*/ ! uid) throw "AdminCheckUserNotAuthenticated";
			 const { valid } = await aobj(adminNodeRef, email);
			 if ( /*NOT->*/ ! valid) throw "AdminCheckAdminEmailNotAllowed";
			 return successResponse({ valid });
	  } catch (error) {
			 return errorOccurred(error, { valid: false });
	  }
}
