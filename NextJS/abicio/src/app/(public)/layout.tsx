"use client";
import { APP_NAME, APP_TAGLINE, AppIcon, NAV_ITEMS } from "@/app/AbicioMaster";
import { AppThemeModeToggleButton } from "@/components/mui/apx/tsx/AppThemeModeProvider";
import CloseOutlined from "@mui/icons-material/CloseOutlined";
import MenuOutlined from "@mui/icons-material/MenuOutlined";
import { AppBar, Box, Container, Divider, Drawer, IconButton, List, ListItemButton, ListItemIcon, ListItemText, Stack, Toolbar, Typography } from "@mui/material";
import { alpha, useTheme } from "@mui/material/styles";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";




function Branding() {
	  return (
				 <Box component={ Link } href={ "/" } gap={ 1 } sx={ { whiteSpace: "nowrap", display: "flex", alignItems: "center", color: "inherit", textDecoration: "none", mr: { xs: "auto" } } }>
						<Image src={ AppIcon } alt={ APP_NAME } height={ 48 } width={ 48 }/>
						<Stack>
							  <Typography variant={ "h5" }>{ APP_NAME }</Typography>
							  <Typography variant={ "caption" } color={ "text.secondary" }>{ APP_TAGLINE }</Typography>
						</Stack>
				 </Box>
	  );
}


export default function PublicLayout({ children }: Readonly<{ children: React.ReactNode }>) {
	  const pathname = usePathname();
	  const theme = useTheme();
	  const [ menuOpen, setMenuOpen ] = React.useState(false);
	  const items = React.useMemo(() => Object.values(NAV_ITEMS), []);
	  return (
				 <Box sx={ { minHeight: "100vh", bgcolor: "background.default", color: "text.primary" } }>
						<AppBar
								  position={ "sticky" } color={ "transparent" } elevation={ 0 }
								  sx={ { borderBottom: 1, borderColor: "divider", bgcolor: alpha(theme.palette.background.paper, 0.90), backdropFilter: "blur(6px)" } }>
							  <Container maxWidth={ "lg" } disableGutters={ true }>
									 <Toolbar sx={ { minHeight: 64, p: 2, gap: 2 } }>
											<Branding/>
											<AppThemeModeToggleButton/>
											<IconButton aria-label={ "Open navigation menu" } onClick={ () => setMenuOpen(true) } color={ "inherit" } size={ "large" }>
												  <MenuOutlined/>
											</IconButton>
									 </Toolbar>
							  </Container>
						</AppBar>
						<Drawer
								  anchor={ "right" }
								  open={ menuOpen }
								  onClose={ () => setMenuOpen(false) }
								  PaperProps={ { sx: { width: { xs: "85vw", sm: 320 }, maxWidth: 360, bgcolor: "background.paper", borderRight: 1, borderColor: "divider" } } }
						>
							  <Stack direction={ "row" } alignItems={ "center" } justifyContent={ "space-between" } sx={ { px: 2, py: 2 } }>
									 <Branding/>
									 <IconButton aria-label={ "Close navigation menu" } onClick={ () => setMenuOpen(false) } color={ "inherit" }>
											<CloseOutlined/>
									 </IconButton>
							  </Stack>
							  
							  <Divider/>
							  
							  <List sx={ { p: 1.5 } }>
									 { items.map((item) => (
												<ListItemButton
														  key={ item.href }
														  component={ Link } href={ item.href } selected={ pathname === item.href } onClick={ () => setMenuOpen(false) }
														  sx={ {
																 mb: 0.5,
																 borderRadius: 2,
																 "&.Mui-selected": {
																		bgcolor: alpha(theme.palette.primary.main, 0.15),
																		color: "primary.main"
																 },
																 "&.Mui-selected:hover": {
																		bgcolor: alpha(theme.palette.primary.main, 0.22)
																 }
														  } }
												>
													  <ListItemIcon sx={ { minWidth: 40, color: pathname === item.href ? "primary.main" : "text.secondary" } }>
															 { item.icon }
													  </ListItemIcon>
													  <ListItemText primary={ item.label } primaryTypographyProps={ { fontWeight: pathname === item.href ? 700 : 500 } }/>
												</ListItemButton>
									 )) }
							  </List>
						</Drawer>
						<Container component={ "main" } maxWidth={ "lg" } sx={ { py: { xs: 3, md: 5 }, px: { xs: 2, sm: 3 } } }>
							  { children }
						</Container>
						<Box component={ "footer" } sx={ { py: 3, borderTop: 1, borderColor: "divider" } }>
							  <Container maxWidth={ "lg" } sx={ { display: "flex", justifyContent: "space-between", alignItems: "center", gap: 2, flexWrap: "wrap" } }>
									 <Typography variant={ "body2" } color={ "text.secondary" }>{ APP_NAME + " · AI-assisted waste segregation" }</Typography>
									 <Typography variant={ "caption" } color={ "text.secondary" }>{ "Always verify disposal guidance against local collection rules." }</Typography>
							  </Container>
						</Box>
				 </Box>
	  );
}
