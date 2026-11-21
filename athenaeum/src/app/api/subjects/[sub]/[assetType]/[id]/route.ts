import { ASSET_TYPES, AssetType, AthAsset } from "@/app/AthenaeumMaster";
import { SubKey } from "@/app/BgcMaster";
import { errorOccurred, successResponse } from "@/firebase/Bridge";
import { invokeServerApp } from "@/firebase/FirebaseApp";
import { doc, getDoc } from "@firebase/firestore";
import { NextRequest } from "next/server";




export async function GET(request: NextRequest, { params }: { params: Promise<{ sub: SubKey; assetType: AssetType; id: string }> }) {
	  try {
			 const { sub, assetType, id } = await params;
			 if ( /*NOT->*/ ! sub || /*NOT->*/ ! ASSET_TYPES.includes(assetType) || /*NOT->*/ ! id) throw "NoParams";
			 const { createAssetCollectionRef } = await invokeServerApp(request);
			 const docSnap = await getDoc(doc(createAssetCollectionRef(assetType), id));
			 if ( /*NOT->*/ ! docSnap.exists()) throw "NotFound";
			 
			 const asset: AthAsset = docSnap.data() || {};
			 if ( /*NOT->*/ ! asset) throw "NotFound";
			 
			 return successResponse({ asset });
	  } catch (error) {
			 return errorOccurred(error, { asset: null });
	  }
}

