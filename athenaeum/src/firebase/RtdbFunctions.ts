import { AppAssets } from "@/components/features/sites/www/AppShowcase";
import { EnquiryData } from "@/components/features/sites/www/EnquiryView";
import { DATA_MODEL_NODE_REFS } from "@/firebase/RtdbNodes";
import { get, push, update } from "firebase/database";


//********************************************************************************
//* GENERATE KEY
//********************************************************************************


export const getAppManifestModel = (onFetched: (appAssets: AppAssets) => void) => {
	  get(DATA_MODEL_NODE_REFS.assetsNodeRef)
				 .then(
							(value) => {
								  if (value.exists()) {
										 const appAssets: AppAssets = value.val().APPS?.manifest;
										 onFetched(appAssets);
								  }
							},
							(reason) => {
								  console.error("Something went wrong in the Database: " + reason.toLocaleString());
							}
				 );
};

export type EnquiryData<P = string, S = string> = { name: string; contact: string; purpose: P, timestamp: string, source: S };


