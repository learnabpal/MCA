"use client";

import { GITHUB_REPOSITORY_URL } from "@/app/AthenaeumMaster";
import GitHub from "@mui/icons-material/GitHub";
import OpenInNewRounded from "@mui/icons-material/OpenInNewRounded";
import { Box, Button, Card, CardContent, Stack, Typography } from "@mui/material";




export default function GitHubPage() {
	  return <Stack spacing={ 3 }>
			 <Box>
					<Typography variant={ "h3" } sx={ { fontWeight: 800, mb: 1 } }>{ "GitHub Repository" }</Typography>
					<Typography color={ "text.secondary" }>{ "Access the MCA project monorepo." }</Typography>
			 </Box>
			 <Card variant={ "outlined" }>
					<CardContent sx={ { p: { xs: 2.5, md: 4 } } }>
						  <Stack spacing={ 2 } alignItems={ "flex-start" }>
								 <GitHub sx={ { fontSize: 44 } }/>
								 <Typography variant={ "h5" } sx={ { fontWeight: 750 } }>{ "MCA Monorepo" }</Typography>
								 <Typography color={ "text.secondary" }>{ "Browse the source code and project files in the repository." }</Typography>
								 <Button variant={ "contained" } href={ GITHUB_REPOSITORY_URL } target={ "_blank" } rel={ "noopener noreferrer" } endIcon={ <OpenInNewRounded/> }>{ "Open Repository" }</Button>
						  </Stack>
					</CardContent>
			 </Card>
	  </Stack>;
}
