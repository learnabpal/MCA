import { ASSET_TYPES, AssetType, AthAsset, buildKey } from "@/app/AthenaeumMaster";
import { errorOccurred, successResponse } from "@/firebase/Bridge";
import { invokeServerApp } from "@/firebase/FirebaseApp";
import { update } from "@firebase/database";
import { doc, setDoc } from "@firebase/firestore";
import { NextRequest } from "next/server";




export async function POST(request: NextRequest) {
	  try {
			 const { assetType, asset } = await request.json() as { assetType: AssetType; asset: AthAsset[] };
			 if ( /*NOT->*/ ! ASSET_TYPES.includes(assetType) || /*NOT->*/ ! Array.isArray(asset) || /*NOT->*/ ! asset.length) throw "NoAssetData";
			 const { uid, createAssetCollectionRef, createSubjectNodeRef } = await invokeServerApp(request);
			 if ( /*NOT->*/ ! uid) throw "UnauthorisedBuilder";
			 
			 const sub = asset[0].sub;
			 if (asset.some(item => item?.sub !== sub)) throw "MixedSubjects";
			 
			 const ref = createSubjectNodeRef(sub, assetType);
			 
			 const rtdbUpdates: Record<string, string> = {};
			 const fsUpdates: Record<string, AthAsset> = {};
			 
			 asset.forEach(item => {
					const key = buildKey();
					rtdbUpdates[key] = item.title;
					fsUpdates[key] = item;
			 });
			 
			 await Promise.all(Object.entries(fsUpdates).map(([ key, item ]) => setDoc(doc(createAssetCollectionRef(assetType), key), item, { merge: true })));
			 await update(ref, rtdbUpdates);
			 
			 return successResponse({});
	  } catch (error) {
			 return errorOccurred(error, null);
	  }
}
