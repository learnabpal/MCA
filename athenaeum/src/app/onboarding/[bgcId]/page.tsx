"use client";

import { CrsKey, getCourseSets, getCourseSubs, SubKey } from "@/app/BgcMaster";
import { bridgeOnboarding, bridgeOnboardingBuilderMetaPOST } from "@/firebase/Bridge";
import { useFirebaseAccountModifiers, useFirebaseUid } from "@/firebase/FirebaseApp";
import { Box, Button, Chip, TextField, Typography } from "@mui/material";
import Stack from "@mui/material/Stack";
import { useParams, useRouter } from "next/navigation";
import React from "react";
import GoogleIcon from "@mui/icons-material/Google";




export default function OnboardingPage() {
	  const { bgcId } = useParams();
	  const router = useRouter();
	  const toBuilder = () => router.replace("/builder");
	  const [ allowed, setAllowed ] = React.useState(undefined);
	  const [ onboardingState, setOnboardingState ] = React.useState<boolean | string>(undefined);
	  const { signInWithGoogle, signOut } = useFirebaseAccountModifiers();
	  const uid = useFirebaseUid();
	  const invalidBgcId = ( /*NOT->*/ ! bgcId || typeof bgcId !== "string");
	  
	  // check rtdb for allowance map
	  // only then proceed
	  React.useEffect(() => {
			 if (invalidBgcId) return;
			 bridgeOnboarding(bgcId).then(
						value => {
							  const { bgcId, obStatus, status } = value.data;
							  const matched = bgcId === bgcId;
							  if (matched && status === "SUCCESS") {
									 setAllowed(true);
									 setOnboardingState(obStatus);
							  }
						}
			 );
	  }, []);
	  
	  React.useEffect(() => {
			 uid && typeof onboardingState === "string" && toBuilder();
	  }, [ onboardingState, uid ]);
	  
	  const [ crsKey, setCrsKey ] = React.useState<CrsKey>("");
	  const [ bgcEmail, setBgcEmail ] = React.useState("");
	  const invalid =  /*NOT->*/ ! crsKey || /*NOT->*/ ! [ "@bhawanipurglobal.edu.in" ].some(suffix => bgcEmail.includes(suffix));
	  
	  if (invalidBgcId) return;
	  const onboard = () => {
			 if (invalid) return;
			 bridgeOnboardingBuilderMetaPOST({ crs: crsKey, email: bgcEmail, bgcId }).then(
						value => value.data.status === "SUCCESS" && toBuilder()
			 );
	  };
	  
	  if (uid) return (
				 <Stack spacing={ 1 } sx={ { height: "100vh", mx: "auto", p: { xs: 2, md: 4 } } } maxWidth={ 480 } justifyContent={ "center" }>
						<Box>
							  <Typography variant={ "body2" } color={ "text.secondary" } sx={ { mb: 1 } }>{ "Course *" }</Typography>
							  <Stack direction={ "row" } spacing={ 1 } useFlexGap flexWrap={ "wrap" }>
									 { getCourseSets().map(([ alpha, value ]) => Object.entries(value).map(([ key, { titles } ]) => (
												<Chip
														  key={ key }
														  label={ titles.full }
														  clickable
														  color={ crsKey === key ? "primary" : "default" }
														  variant={ crsKey === key ? "filled" : "outlined" }
														  onClick={ () => setCrsKey(crsKey === key ? "" : key as CrsKey) }
												/>
									 ))) }
							  </Stack>
						</Box>
						<Box>
							  <Typography variant={ "body2" } color={ "text.secondary" } sx={ { mb: 1 } }>{ "BGC Email *" }</Typography>
							  <TextField inputMode={ "email" } value={ bgcEmail } onChange={ (e) => setBgcEmail(e.target.value) } fullWidth required/>
						</Box>
						<Button variant={ "contained" } fullWidth onClick={ () => onboard() } disabled={ invalid }>{ "Onboard" }</Button>
				 </Stack>
	  );
	  
	  return (allowed) && (
				 <Stack spacing={ 1 } sx={ { height: "100vh", mx: "auto", p: { xs: 2, md: 4 } } } maxWidth={ 480 } justifyContent={ "center" }>
						<Button variant={ "contained" } fullWidth onClick={ () => signInWithGoogle() } startIcon={ <GoogleIcon/> }>{ "Sign-In with Google" }</Button>
				 </Stack>
	  );
}
