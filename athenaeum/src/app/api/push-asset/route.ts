import { AssetType, AthAsset, AthRtdbMap, buildKey, content, download, subject } from "@/app/AthenaeumMaster";
import { SubKey } from "@/app/BgcMaster";
import { errorOccurred, successResponse } from "@/firebase/Bridge";
import { invokeServerApp } from "@/firebase/FirebaseApp";
import { push, update } from "@firebase/database";
import { doc, updateDoc } from "@firebase/firestore";
import { NextRequest } from "next/server";




export async function POST(request: NextRequest) {
	  try {
			 const { assetType, asset } = await request.json() as { assetType: AssetType; asset: AthAsset[] };
			 if ( /*NOT->*/ ! assetType || /*NOT->*/ ! asset || /*NOT->*/ ! asset.length) throw "NoAssetData";
			 const { uid, contentCollectionRef, createSubjectNodeRef } = await invokeServerApp(request);
			 if ( /*NOT->*/ ! uid) throw "UnauthorisedBuilder";
			 
			 const sub = asset[0].sub;
			 const isContent = assetType === content;
			 const subjectNodeRef = createSubjectNodeRef(sub, assetType);
			 const rtdbUpdates: AthRtdbMap[typeof subject][SubKey][AssetType] = {};
			 const fsUpdates: AthRtdbMap[typeof subject][SubKey][typeof download] = {};
			 
			 asset.forEach(item => {
					const key = buildKey();
					Object.assign(rtdbUpdates, { [key]: isContent ? item.title : item });
					if (isContent) Object.assign(fsUpdates, { [key]: item });
			 });
			 
			 if (isContent) await updateDoc(doc(contentCollectionRef, sub), fsUpdates);
			 await update(subjectNodeRef, rtdbUpdates);
			 
			 return successResponse({});
	  } catch (error) {
			 return errorOccurred(error, null);
	  }
}
