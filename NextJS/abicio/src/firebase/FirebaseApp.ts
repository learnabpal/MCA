import { isInRestrictedList } from "@/components/mui/apx/ts/Utils";
import { getAuth } from "@firebase/auth";
import { child } from "@firebase/database";
import { getFirestore } from "@firebase/firestore";
import { getDownloadURL, getStorage, ref as storageRef } from "@firebase/storage";
import axios from "axios";
import { initializeApp, initializeServerApp } from "firebase/app";
import { getDatabase, ref as rtdbRef } from "firebase/database";
import { NextRequest } from "next/server";
import React from "react";
import { useAuthState, useCreateUserWithEmailAndPassword, useDeleteUser, useSendEmailVerification, useSendPasswordResetEmail, useSignInWithEmailAndPassword, useSignInWithGoogle, useSignOut } from "react-firebase-hooks/auth";


// https://firebase.google.com/docs/web/setup#available-libraries

const firebaseConfig = {
	  apiKey: "AIzaSyDeYY37ptaV8wAZHz6HPhmOA6l6Zh3lsDw",
	  authDomain: "apxdgtlcorpus.firebaseapp.com",
	  projectId: "apxdgtlcorpus",
	  storageBucket: "apxdgtlcorpus.firebasestorage.app",
	  messagingSenderId: "858167019558",
	  appId: "1:858167019558:web:08d5e47c6c399799997ee7"
};


// INITIALISE FIREBASE
const firebaseClientApp = initializeApp(firebaseConfig);
// INITIALISE SERVICES
const rtDb = getDatabase(firebaseClientApp);
const fsDb = getFirestore(firebaseClientApp);
const storage = getStorage(firebaseClientApp);


// EXPORT SERVICES

const auth = getAuth(firebaseClientApp);
export const RTDB_ROOT_REF = rtdbRef(rtDb);

const FIRESTORE_ROOT_REF = fsDb;
const STORAGE_ROOT_REF = storage;


// THIS IS MANDATORY FOR REACT-NATIVE PERSISTENCE
// const auth = FirebaseAuthForTS.initializeAuth(firebaseApp, {
// 	  persistence: Platform.OS === "web" ? FirebaseAuthForTS.browserLocalPersistence : FirebaseAuthForTS.getReactNativePersistence(AsyncStorage)
// });

// const auth = FirebaseAuthForTS.getAuth(firebaseApp);

export const useFirebaseUid = () => {
	  return useAuthState(auth)[0]?.uid /* || "apxdgtl" */;
	  // const [ user ] = useAuthState(auth);
	  // if ( /*NOT->*/ ! user) return undefined;
	  // const uid = user.uid;
	  // if ( /*NOT->*/ ! uid) return undefined;
	  // return uid;
	  // if (isInRestrictedList(user.email)) return uid;
	  // return user?.emailVerified ? uid : undefined;
};

export const useFirebaseUserEmail = () => useAuthState(auth)[0]?.email?.toLowerCase() /* || "apxdgtl@gmail.com" */;
export const useFirebaseUserData = () => {
	  const { displayName = "—", email = "", photoURL = "" } = useAuthState(auth)[0] || {};
	  return { displayName, email, photoURL };
};

export const useFirebaseAccountModifiers = () => {
	  const [ createUserWithEmailAndPassword ] = useCreateUserWithEmailAndPassword(auth);
	  const [ sendEmailVerification ] = useSendEmailVerification(auth);
	  const [ signInWithEmailAndPassword ] = useSignInWithEmailAndPassword(auth);
	  const [ sendPasswordResetEmail ] = useSendPasswordResetEmail(auth);
	  const [ signInWithGoogle ] = useSignInWithGoogle(auth);
	  const signOut = () => auth.signOut();
	  return { signInWithGoogle, createUserWithEmailAndPassword, sendEmailVerification, signOut, signInWithEmailAndPassword, sendPasswordResetEmail };
};

export const useFirebaseSignOut = () => {
	  const uid = useFirebaseUid();
	  const [ signOut, signingOut, signOutError ] = useSignOut(auth);
	  return { uid, signOut, signingOut, signOutError };
};

export const useFirebaseDeleteUser = () => {
	  const uid = useFirebaseUid();
	  const [ deleteUser, deleting, deletionError ] = useDeleteUser(auth);
	  return { uid, deleteUser, deleting, deletionError };
};

export const useStorageDownloadUrls = (paths: string[]) => {
	  const [ mediaUrls, setMediaUrls ] = React.useState<string[]>([]);
	  React.useEffect(() => {
			 const urls = paths.map(path => getDownloadURL(storageRef(STORAGE_ROOT_REF, path)));
			 Promise.all(urls).then(urls => setMediaUrls(urls));
	  }, [ paths ]);
	  return { mediaUrls };
};


const HOST_NODE = "HOST";
const HANDLE_MAP_NODE = "HANDLE";
const PROFILE_COLLECTION = "PROFILE";
const SERVICE_COLLECTION = "SERVICE";
const CLAIM_NODE = "CLAIM";
const CONTENT_COLLECTION = "CONTENT";
const GATEWAY_NODE = "GATEWAY";
const ARCHIVE_NODE = "ARCHIVE";
const TRASHED_NODE = "TRASHED";
const SHARDS_COLLECTION = "SHARDS";

const SHARD_PREFIX = "SHARD";

const ENQUIRIES_NODE = "ENQUIRIES";


export {
	  HOST_NODE, HANDLE_MAP_NODE, SERVICE_COLLECTION, PROFILE_COLLECTION, CLAIM_NODE, CONTENT_COLLECTION,
	  RTDB_ROOT_REF, FIRESTORE_ROOT_REF, STORAGE_ROOT_REF, GATEWAY_NODE, ARCHIVE_NODE, TRASHED_NODE,
	  SHARDS_COLLECTION, SHARD_PREFIX
};


//********************************************************************************
//* SERVER APP
//********************************************************************************


// RTDB keys must be non-empty strings and can't contain ".", "#", "$", "/", "[", or "]"

const BEARER = "Bearer ";

const invokeServerApp = (request?: NextRequest) => {
	  const authIdToken = request?.headers?.get("authorization")?.split(BEARER)[1] || undefined;
	  // if ( /*NOT->*/ ! authIdToken) return;
	  const firebaseServerApp = initializeServerApp(firebaseClientApp, { authIdToken, releaseOnDeref: request?.headers });
	  const auth = getAuth(firebaseServerApp);
	  return auth.authStateReady().then(() => {
			 const user = auth.currentUser;
			 // if (  /*NOT->*/ ! user) return;
			 
			 const rtdbRoot = rtdbRef(getDatabase(firebaseServerApp));
			 const firestoreRoot = getFirestore(firebaseServerApp);
			 const storageRoot = getStorage(firebaseServerApp);
			 
			 // const handleMapNodeRef: DatabaseReference = child(rtdbRoot, HANDLE_MAP_NODE);
			 // const hostNodeRef: DatabaseReference = child(rtdbRoot, HOST_NODE);
			 // const claimNodeRef: DatabaseReference = child(rtdbRoot, CLAIM_NODE);
			 //
			 // const profileCollectionRef: CollectionReference = collection(firestoreRoot, PROFILE_COLLECTION);
			 // // const profileStorageRef: StorageReference = storageRef(storageRoot, PROFILE_COLLECTION);
			 //
			 // const serviceCollectionRef: CollectionReference = collection(firestoreRoot, SERVICE_COLLECTION);
			 // // const serviceStorageRef: StorageReference = storageRef(storageRoot, SERVICE_COLLECTION);
			 //
			 // const contentCollectionRef: CollectionReference = collection(firestoreRoot, CONTENT_COLLECTION);
			 // const { guide, event } = GATEWAY_CONTENT_REUSABLE_KEYS;
			 
			 // CONTENT SHARDS SUB-COLLECTIONS
			 // const contentGuideShardsCollectionRef = collection(contentCollectionRef, guide, SHARDS_COLLECTION);
			 // const contentEventShardsCollectionRef = collection(contentCollectionRef, event, SHARDS_COLLECTION);
			 
			 const gatewayNodeRef = child(rtdbRoot, GATEWAY_NODE);
			 const archiveNodeRef = child(rtdbRoot, ARCHIVE_NODE);
			 const trashedNodeRef = child(rtdbRoot, TRASHED_NODE);
			 
			 const enquiriesNodeRef = child(RTDB_ROOT_REF, ENQUIRIES_NODE);
			 
			 return ({
					uid: user?.uid,
					email: user?.email,
					createStorageRef: (path: string) => storageRef(storageRoot, path),
					rtdbRoot, firestoreRoot, storageRoot,
					// handleMapNodeRef, hostNodeRef, claimNodeRef,
					/* contentCollectionRef, gatewayCollectionRef */
					// profileCollectionRef, serviceCollectionRef,
					// contentGuideShardsCollectionRef, contentEventShardsCollectionRef,
					gatewayNodeRef, // archiveNodeRef, trashedNodeRef
					enquiriesNodeRef
					/* profileStorageRef, serviceStorageRef */
			 });
	  });
};

const api = axios.create({ baseURL: "/api" });
api.interceptors.request.use(async config => {
	  const user = auth.currentUser;
	  if (user) {
			 const idToken = await user.getIdToken();
			 config.headers = config.headers || {};
			 config.headers.Authorization = BEARER + idToken;
	  }
	  return config;
});
export { invokeServerApp, api };
