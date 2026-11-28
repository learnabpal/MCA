"use client";

import { useFirebaseAccountModifiers } from "@/firebase/FirebaseApp";
import GoogleIcon from "@mui/icons-material/Google";
import { Button } from "@mui/material";
import React from "react";




export default function GoogleSignInButton() {
	  const { signInWithGoogle } = useFirebaseAccountModifiers();
	  return (
				 <Button variant={ "contained" } color={ "secondary" } sx={ { color: "primary.main" } } onClick={ () => signInWithGoogle() } startIcon={ <GoogleIcon/> }>
						{ "Sign-In with Google" }
				 </Button>
	  );
}

