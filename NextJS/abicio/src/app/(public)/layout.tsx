"use client";
import AbicioShell from "@/components/AbicioShell";
import { AppThemeModeToggleButton } from "@/components/mui/apx/tsx/AppThemeModeProvider";
import EcoOutlined from "@mui/icons-material/EnergySavingsLeafOutlined";
import HistoryOutlined from "@mui/icons-material/HistoryOutlined";
import RecyclingOutlined from "@mui/icons-material/RecyclingOutlined";
import TravelExploreOutlined from "@mui/icons-material/TravelExploreOutlined";
import { AppBar, Box, Button, Container, Stack, Toolbar, Typography } from "@mui/material";
import { alpha, useTheme } from "@mui/material/styles";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";




export const NAV_ITEMS = {
	  overview: {
			 label: "Overview",
			 href: "/",
			 icon: <EcoOutlined fontSize={ "small" }/>
	  },
	  analyse: {
			 label: "Analyse Waste",
			 href: "/analyse",
			 icon: <TravelExploreOutlined fontSize={ "small" }/>
	  },
	  history: {
			 label: "History",
			 href: "/history",
			 icon: <HistoryOutlined fontSize={ "small" }/>
	  }
} as const;


export default function PublicLayout({ children }: Readonly<{ children: React.ReactNode }>) {
	  const pathname = usePathname();
	  const theme = useTheme();
	  const items = React.useMemo(() => Object.values(NAV_ITEMS), []);
	  return (
				 <Box sx={ { minHeight: "100vh", bgcolor: "background.default", color: "text.primary" } }>
						<AppBar
								  position={ "sticky" } color={ "transparent" } elevation={ 0 }
								  sx={ { borderBottom: 1, borderColor: "divider", bgcolor: alpha(theme.palette.background.paper, 0.90), backdropFilter: "blur(6px)" } }>
							  <Container maxWidth={ "lg" } disableGutters={ true }>
									 <Toolbar sx={ { minHeight: { xs: 68, sm: 76 }, px: { xs: 2, sm: 3 }, gap: 2 } }>
											<Box component={ Link } href={ "/" } sx={ { display: "flex", alignItems: "center", gap: 1.2, color: "inherit", textDecoration: "none", mr: { xs: "auto", md: 2 } } }>
												  <Box sx={ { display: "grid", placeItems: "center", width: 42, height: 42, borderRadius: 2, bgcolor: "primary.main", color: "primary.contrastText" } }>
														 <RecyclingOutlined fontSize={ "medium" }/>
												  </Box>
												  <Box>
														 <Typography variant={ "h5" } sx={ { lineHeight: 1 } }>Abicio</Typography>
														 <Typography variant={ "caption" } color={ "text.secondary" }>Waste Intelligence</Typography>
												  </Box>
											</Box>
											<Stack direction={ "row" } spacing={ 0.5 } sx={ { display: { xs: "none", sm: "flex" } } }>
												  { items.map((item) => <Button key={ item.href } component={ Link } href={ item.href } startIcon={ item.icon } color={ pathname === item.href ? "primary" : "inherit" } variant={ pathname === item.href ? "contained" : "text" } sx={ { whiteSpace: "nowrap" } }>{ item.label }</Button>) }
											</Stack>
											<AppThemeModeToggleButton/>
									 </Toolbar>
									 <Stack direction={ "row" } spacing={ 1 } sx={ { display: { xs: "flex", sm: "none" }, px: 2, pb: 1.5, overflowX: "auto" } }>
											{ items.map((item) => <Button key={ item.href } component={ Link } href={ item.href } startIcon={ item.icon } color={ pathname === item.href ? "primary" : "inherit" } variant={ pathname === item.href ? "contained" : "text" } size={ "small" } sx={ { flexShrink: 0 } }>{ item.label }</Button>) }
									 </Stack>
							  </Container>
						</AppBar>
						<Container component={ "main" } maxWidth={ "lg" } sx={ { py: { xs: 3, md: 5 }, px: { xs: 2, sm: 3 } } }>
							  { children }
						</Container>
						<Box component={ "footer" } sx={ { py: 3, borderTop: 1, borderColor: "divider" } }>
							  <Container maxWidth={ "lg" } sx={ { display: "flex", justifyContent: "space-between", alignItems: "center", gap: 2, flexWrap: "wrap" } }>
									 <Typography variant={ "body2" } color={ "text.secondary" }>Abicio · AI-assisted waste segregation</Typography>
									 <Typography variant={ "caption" } color={ "text.secondary" }>Always verify disposal guidance against local collection rules.</Typography>
							  </Container>
						</Box>
				 </Box>
	  );
}
