"use client";

import RefreshIcon from "@mui/icons-material/Refresh";
import { IconButton, Stack, TextField, Typography } from "@mui/material";
import React from "react";




export default function NumberCaptcha({ onVerified }: { onVerified: (isValid: boolean) => void; }) {
	  const [ challenge, setChallenge ] = React.useState<{ num1: number; num2: number; expected: number }>(() => {
			 const n1 = Math.floor(Math.random() * 9) + 1;
			 const n2 = Math.floor(Math.random() * 9) + 1;
			 return { num1: n1, num2: n2, expected: n1 + n2 };
	  });
	  const [ userAnswer, setUserAnswer ] = React.useState<string>("");
	  
	  const handleRefresh = () => {
			 const n1 = Math.floor(Math.random() * 9) + 1;
			 const n2 = Math.floor(Math.random() * 9) + 1;
			 setChallenge({ num1: n1, num2: n2, expected: n1 + n2 });
			 setUserAnswer("");
			 onVerified(false);
	  };
	  
	  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
			 const val = e.target.value;
			 setUserAnswer(val);
			 const numericVal = parseInt(val, 10);
			 const valid = /*TRUTHY->*/ !! (val.trim() && numericVal === challenge.expected);
			 onVerified(valid);
	  };
	  
	  return (
				 <Stack sx={ { p: 1, maxWidth: "320px" } } alignSelf={ "center" } alignItems={ "center" }>
						<Typography variant={ "body1" }>{ "Please solve the security check:" }</Typography>
						<Stack direction={ "row" } spacing={ 1 } alignItems={ "center" }>
							  <Typography variant={ "h6" }>{ `${ challenge.num1 } + ${ challenge.num2 } =` }</Typography>
							  <TextField size={ "small" } value={ userAnswer } onChange={ handleChange } style={ { width: "80px" } }/>
							  <IconButton size={ "small" } onClick={ handleRefresh }><RefreshIcon fontSize={ "small" }/></IconButton>
						</Stack>
				 </Stack>
	  );
}
