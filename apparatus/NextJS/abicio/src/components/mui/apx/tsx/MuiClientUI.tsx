"use client";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import IconButton from "@mui/material/IconButton";
import Link from "@mui/material/Link";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import React from "react";
import ReactMarkdown from "react-markdown";




export const Holder = ({ children, maxWidth = "sm", spacing = 4 }) => {
	  return <Container sx={ { alignSelf: "center" } } maxWidth={ maxWidth }>
			 <Stack spacing={ spacing }>
					{ children }
			 </Stack>
	  </Container>;
};




export const IconLinkOpenInNew = ({ link }) => {
	  return (/*TRUTHY->*/ !! link) && <IconButton
				 onClick={ () => window.open(link, "_blank", "noopener,noreferrer") }
				 color={ "inherit" }
	  >
			 <OpenInNewIcon fontSize={ "inherit" }/>
	  </IconButton>;
};





export const MarkdownText = ({ text }: { text: string }) => {
	  const fontFamily = "Roboto Condensed, Arial, sans-serif";
	  const fontWeight = 400;
	  return (
				 <Box sx={ { opacity: 0.85 } }>
						<ReactMarkdown
								  components={ {
										 h1: ({ children }) => <Typography variant={ "h1" } sx={ { py: 1 } }>{ children }</Typography>,
										 h2: ({ children }) => <Typography variant={ "h2" } sx={ { py: 1 } }>{ children }</Typography>,
										 h3: ({ children }) => <Typography variant={ "h3" } sx={ { py: 1 } }>{ children }</Typography>,
										 h4: ({ children }) => <Typography variant={ "h4" } sx={ { py: 1 } }>{ children }</Typography>,
										 h5: ({ children }) => <Typography variant={ "h5" } sx={ { py: 1 } }>{ children }</Typography>,
										 h6: ({ children }) => <Typography variant={ "h6" } sx={ { py: 1 } }>{ children }</Typography>,
										 p: ({ children }) => <Typography component={ "div" } variant={ "body1" } sx={ { fontFamily, fontWeight, py: 1, textAlign: "justify" } }>{ children }</Typography>,
										 li: ({ children }) => <li style={ { marginBottom: 2 } }><Typography component={ "div" } variant={ "body1" } sx={ { fontFamily, fontWeight } }>{ children }</Typography></li>,
										 hr: () => <Box sx={ { borderBottom: "1px solid", borderColor: "divider", margin: "24px 0" } }/>,
										 em: ({ children }) => <Typography component={ "span" } sx={ { fontFamily, fontStyle: "italic", color: "secondary.main" } }>{ children }</Typography>,
										 strong: ({ children }) => <Typography component={ "span" } sx={ { fontFamily, fontWeight: 900 } }>{ children }</Typography>,
										 b: ({ children }) => <Typography component={ "span" } sx={ { fontFamily, fontWeight: 900 } }>{ children }</Typography>,
										 a: ({ children, href }) => <Link href={ href } target={ "_blank" } rel={ "noopener noreferrer" }>{ children }</Link>
								  } }
						>
							  { text }
						</ReactMarkdown>
				 </Box>
	  );
};


