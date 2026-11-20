import { AthAsset } from "@/app/AthenaeumMaster";
import { SubKey } from "@/app/BgcMaster";
import { errorOccurred, successResponse } from "@/firebase/Bridge";
import { invokeServerApp } from "@/firebase/FirebaseApp";
import { doc, getDoc } from "@firebase/firestore";
import { NextRequest } from "next/server";




export async function GET(request: NextRequest, { params }: { params: Promise<{ sub: SubKey; id: string }> }) {
	  try {
			 const { sub, id } = await params;
			 if ( /*NOT->*/ ! sub || /*NOT->*/ ! id) throw "NoParams";
			 const { contentCollectionRef } = await invokeServerApp(request);
			 const docSnap = await getDoc(doc(contentCollectionRef, sub));
			 if ( /*NOT->*/ ! docSnap.exists()) throw "NotFound";
			 
			 const docData = docSnap.data() as Record<string, AthAsset>;
			 const asset = docData?.[id];
			 if ( /*NOT->*/ ! asset) throw "NotFound";
			 
			 return successResponse({ asset });
	  } catch (error) {
			 return errorOccurred(error, { asset: null });
	  }
}

