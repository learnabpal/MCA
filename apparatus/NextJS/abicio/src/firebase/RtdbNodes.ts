import { RTDB_ROOT_REF } from "@/firebase/FirebaseApp";
import { child, DatabaseReference } from "firebase/database";




const ASSETS_NODE = "ASSETS";
const assetsNodeRef = child(RTDB_ROOT_REF, ASSETS_NODE);

const AP_NODE = "AP";
const apNodeRef = child(RTDB_ROOT_REF, AP_NODE);

const ENQUIRIES_NODE = "ENQUIRIES";
const enquiriesNodeRef = child(RTDB_ROOT_REF, ENQUIRIES_NODE);

const apCourseraNodeRef = child(apNodeRef, "coursera");
const apJournalNodeRef = child(apNodeRef, "journal");
const apBloggerNodeRef = child(apNodeRef, "blogger");
const assetsCourseraNodeRef = child(assetsNodeRef, [ "PORTFOLIO", "relevant", "education", "certificates", "coursera" ].join("/"));

export const DATA_MODEL_NODE_NAMES = {
	  ASSETS_NODE,
	  AP_NODE,
	  ENQUIRIES_NODE
} as const;

export const DATA_MODEL_NODE_REFS = {
	  assetsNodeRef, assetsCourseraNodeRef,
	  apNodeRef, apCourseraNodeRef, apJournalNodeRef, apBloggerNodeRef,
	  enquiriesNodeRef
} as const;


/**
 * INCLUDES ALL NODES INCLUDING DYNAMICALLY ADDED NODES FROM OTHER MODULES (APXFireduxSync.ts, APXPlus.ts, etc.)
 */
export const ALL_NODE_REFS: DatabaseReference[] = [
	  ...Object.values(DATA_MODEL_NODE_REFS)
];
