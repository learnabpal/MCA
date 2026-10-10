"use client";
import Paper, { PaperProps } from "@mui/material/Paper";
import { alpha, useTheme } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import { animated, config, useSpring } from "@react-spring/web";
import React from "react";




/**
 * Universal Animated Paper Component
 * Prioritises physics-based interactions and glassmorphism.
 * Strictly uses UK English naming conventions.
 */

export type SpringPaperProps = {
	  /**
		* The base identity colour used for gradients, borders, and glows.
		* Supports hex strings or theme paths (e.g., "primary.main").
		*/
	  colour?: string;
	  children: React.ReactNode;
} & PaperProps;

const AnimatedPaper = animated(Paper);

/**
 * Internal hook to resolve the base identity colour from the theme or raw string.
 * Ensures zero code duplication and provides hardened safety fallbacks.
 */
export const useSpringColour = (colour?: string) => {
	  
	  const theme = useTheme();
	  return React.useMemo(() => {
			 // Case: No colour provided
			 if ( ! colour) return theme.palette.primary.main;
			 
			 const palette = theme.palette as any;
			 
			 // 1. Shorthand Palette Key (e.g. "primary") -> maps to .main
			 if (palette[colour] && palette[colour].main) {
					return palette[colour].main;
			 }
			 
			 // 2. Full Theme Path (e.g. "primary.light")
			 const parts = colour.split(".");
			 if (parts.length === 2 && palette[parts[0]]) {
					const resolved = palette[parts[0]][parts[1]];
					if (resolved) return resolved;
			 }
			 
			 // 3. Raw CSS Colour String (hex, rgb, hsl, etc.)
			 const isRaw = colour.startsWith("#") || colour.includes("rgb") || colour.includes("hsl");
			 if (isRaw) return colour;
			 
			 // Final Fallback: Avoid returning unresolvable path strings (breaks MUI alpha)
			 return theme.palette.primary.main;
	  }, [ colour, theme ]);
};

/**
 * A highly reusable, animated surface with glassmorphism and reactive glow.
 */
export const SpringPaper = ({ colour, children, sx, ...props }: SpringPaperProps) => {
	  const theme = useTheme();
	  const baseColour = useSpringColour(colour);
	  const [ hovered, setHovered ] = React.useState(false);
	  
	  const springs = useSpring({
			 transform: hovered ? `translateY(${ theme.spacing(-0.5) })` : "translateY(0px)",
			 boxShadow: hovered
						? `0 ${ theme.spacing(1) } ${ theme.spacing(4) } ${ alpha(baseColour, 0.3) }`
						: `0 ${ theme.spacing(0.25) } ${ theme.spacing(1) } ${ alpha(theme.palette.common.black, 0.1) }`,
			 backgroundColor: alpha(
						theme.palette.background.paper,
						theme.palette.mode === "dark" ? (hovered ? 0.8 : 0.6) : 1
			 ),
			 borderColor: hovered ? baseColour : alpha(baseColour, 0.3),
			 config: config.gentle
	  });
	  
	  const glassBackground = `linear-gradient(135deg, ${ alpha(baseColour, hovered ? 0.2 : 0.15) }, ${ alpha(baseColour, hovered ? 0.1 : 0.05) })`;
	  
	  return (
				 <AnimatedPaper
							{ ...props }
							elevation={ 0 }
							onMouseEnter={ () => setHovered(true) }
							onMouseLeave={ () => setHovered(false) }
							style={ springs as any }
							sx={ {
								  p: 4,
								  height: "100%",
								  display: "flex",
								  flexDirection: "column",
								  justifyContent: "space-between",
								  gap: 3,
								  position: "relative",
								  backdropFilter: "blur(12px)",
								  border: "2px solid",
								  cursor: props.onClick ? "pointer" : "default",
								  transition: "none !important",
								  ...sx,
								  backgroundImage: glassBackground
							} }
				 >
						{ children }
				 </AnimatedPaper>
	  );
};

/**
 * A static premium glass container for high-impact content.
 * Provides a consistent frosted aesthetic without interactive physics.
 */
export const SpringGlass = ({ colour, children, sx, ...props }: SpringPaperProps) => {
	  const theme = useTheme();
	  const baseColour = useSpringColour(colour);
	  
	  const glassBackground = `linear-gradient(135deg, ${ alpha(baseColour, 0.15) }, ${ alpha(baseColour, 0.05) })`;
	  
	  return (
				 <Paper
							{ ...props }
							elevation={ 0 }
							sx={ {
								  p: 4,
								  display: "flex",
								  flexDirection: "column",
								  justifyContent: "center",
								  gap: 3,
								  position: "relative",
								  backdropFilter: "blur(12px)",
								  backgroundColor: alpha(
											 theme.palette.background.paper,
											 theme.palette.mode === "dark" ? 0.6 : 1
								  ),
								  border: "2px solid",
								  borderColor: alpha(baseColour, 0.3),
								  cursor: props.onClick ? "pointer" : "default",
								  ...sx,
								  backgroundImage: glassBackground
							} }
				 >
						{ children }
				 </Paper>
	  );
};


export const SpringButton = ({ colour, onClick, label }) => {
	  const baseColour = useSpringColour(colour);
	  return (
				 <SpringPaper
							colour={ colour }
							onClick={ onClick }
							sx={ { p: 2, flex: 1, display: "flex", alignItems: "center", justifyContent: "center", textAlign: "center" } }
				 >
						<Typography variant={ "button" } sx={ { fontWeight: 900, color: baseColour, whiteSpace: "nowrap" } }>
							  { label }
						</Typography>
				 </SpringPaper>
	  );
};


/**
 * Universal physics configuration for premium, bouncy interactions.
 */
export const springPhysics = { tension: 280, friction: 60 };

/**
 * A reusable entrance animation hook that lifts content into view.
 * Uses consistent physics for a premium feel.
 */
export const useSpringLift = () => {
	  return useSpring({
			 from: { opacity: 0, transform: "translateY(20px)" },
			 to: { opacity: 1, transform: "translateY(0px)" },
			 config: springPhysics
	  });
};
