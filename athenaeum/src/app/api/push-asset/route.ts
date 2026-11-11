import { ASSET_TYPES, AssetType, AthAsset, AthRtdbMap, buildKey, content, download, subject } from "@/app/AthenaeumMaster";
import { SubKey } from "@/app/BgcMaster";
import { errorOccurred, successResponse } from "@/firebase/Bridge";
import { invokeServerApp } from "@/firebase/FirebaseApp";
import { push, update } from "@firebase/database";
import { doc, updateDoc } from "@firebase/firestore";
import { NextRequest } from "next/server";




export async function POST(request: NextRequest) {
	  try {
			 const { assetType, asset } = await request.json() as { assetType: AssetType; asset: AthAsset[] };
			 if ( /*NOT->*/ ! ASSET_TYPES.includes(assetType) || /*NOT->*/ ! Array.isArray(asset) || /*NOT->*/ ! asset.length) throw "NoAssetData";
			 const { uid, contentCollectionRef, createSubjectNodeRef } = await invokeServerApp(request);
			 if ( /*NOT->*/ ! uid) throw "UnauthorisedBuilder";
			 
			 const sub = asset[0].sub;
			 if (asset.some(item => item?.sub !== sub)) throw "MixedSubjects";

			 const subjectNodeRef = createSubjectNodeRef(sub, assetType);
			 
			 const rtdbContentUpdates: Record<string, string> = {};
			 const rtdbDownloadUpdates: Record<string, AthAsset> = {};
			 const fsUpdates: Record<string, AthAsset> = {};
			 
			 asset.forEach(item => {
					const key = buildKey();
					switch (assetType) {
						  case content:
								 rtdbContentUpdates[key] = item.title;
								 fsUpdates[key] = item;
								 break;
						  case download:
								 rtdbDownloadUpdates[key] = item;
								 break;
					}
			 });
			 
			 switch (assetType) {
					case content:
						  await updateDoc(doc(contentCollectionRef, sub), fsUpdates);
						  await update(subjectNodeRef, rtdbContentUpdates);
						  break;
					case download:
						  await update(subjectNodeRef, rtdbDownloadUpdates);
						  break;
			 }
			 
			 return successResponse({});
	  } catch (error) {
			 return errorOccurred(error, null);
	  }
}
