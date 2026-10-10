"use client";

import DarkModeOutlined from "@mui/icons-material/DarkModeOutlined";
import LightModeOutlined from "@mui/icons-material/LightModeOutlined";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v16-appRouter";
import { amber, blueGrey, common, deepOrange, green, lightBlue, lightGreen, teal } from "@mui/material/colors";
import CssBaseline from "@mui/material/CssBaseline";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import { alpha, createTheme, Theme, ThemeProvider } from "@mui/material/styles";
import React from "react";

export type ThemeMode = "dark" | "light";

type ThemeContextValue = { mode: ThemeMode; toggle: () => void };

const AppThemeContext = React.createContext<ThemeContextValue | null>(null);

const createAppTheme = (mode: ThemeMode): Theme => {
    const isDark = mode === "dark";
    const primary = isDark ? lightGreen[400] : green[800];
    const secondary = isDark ? teal[300] : teal[700];
    return createTheme({
        palette: {
            mode,
            primary: { main: primary, contrastText: isDark ? blueGrey[900] : common.white },
            secondary: { main: secondary, contrastText: common.white },
            success: { main: isDark ? lightGreen[400] : green[700] },
            info: { main: isDark ? lightBlue[300] : lightBlue[800] },
            warning: { main: isDark ? amber[300] : amber[800] },
            error: { main: isDark ? deepOrange[300] : deepOrange[700] },
            background: { default: isDark ? common.black : blueGrey[50], paper: isDark ? blueGrey[900] : common.white },
            text: { primary: isDark ? blueGrey[50] : blueGrey[900], secondary: isDark ? blueGrey[300] : blueGrey[700], disabled: blueGrey[500] },
            divider: isDark ? alpha(lightGreen[400], 0.2) : alpha(green[800], 0.18)
        },
        typography: {
            fontFamily: '"Roboto", "Arial", sans-serif',
            fontSize: 13,
            fontWeightLight: 300,
            fontWeightRegular: 400,
            fontWeightMedium: 600,
            fontWeightBold: 800,
            h1: { fontSize: 40, fontWeight: 900, letterSpacing: "-0.04em" },
            h2: { fontSize: 32, fontWeight: 900, letterSpacing: "-0.03em" },
            h3: { fontSize: 27, fontWeight: 800 },
            h4: { fontSize: 23, fontWeight: 800 },
            h5: { fontSize: 19, fontWeight: 800 },
            h6: { fontSize: 16, fontWeight: 800 },
            subtitle1: { fontSize: 15, fontWeight: 600 }
        },
        shape: { borderRadius: 3 },
        components: {
            MuiPaper: { defaultProps: { elevation: 0 }, styleOverrides: { root: { backgroundImage: "none" } } },
            MuiCard: { defaultProps: { variant: "outlined" }, styleOverrides: { root: { borderColor: alpha(isDark ? lightGreen[400] : green[800], 0.18), borderRadius: 18 } } },
            MuiButton: { defaultProps: { variant: "contained" }, styleOverrides: { root: { textTransform: "none", fontWeight: 700, borderRadius: 10, padding: "9px 18px" } } },
            MuiOutlinedInput: { styleOverrides: { root: { borderRadius: 10 } } },
            MuiChip: { styleOverrides: { root: { fontWeight: 700 } } }
        }
    });
};

export const useAppThemeMode = (): ThemeContextValue => {
    const context = React.useContext(AppThemeContext);
    if (context === null) throw new Error("useAppThemeMode must be used within AppThemeModeProvider.");
    return context;
};

export default function AppThemeModeProvider({ children }: { children: React.ReactNode }) {
    const [mode, setMode] = React.useState<ThemeMode>("dark");
    React.useEffect(() => {
        try {
            const stored = window.localStorage.getItem("abicio-theme");
            if (stored === "dark" || stored === "light") setMode(stored);
        } catch (error) {
            console.warn("Abicio could not read the saved theme preference.", error);
        }
    }, []);
    const toggle = React.useCallback(() => {
        setMode((current) => {
            const next: ThemeMode = current === "dark" ? "light" : "dark";
            try {
                window.localStorage.setItem("abicio-theme", next);
            } catch (error) {
                console.warn("Abicio could not save the theme preference.", error);
            }
            return next;
        });
    }, []);
    const theme = React.useMemo(() => createAppTheme(mode), [mode]);
    const contextValue = React.useMemo(() => ({ mode, toggle }), [mode, toggle]);
    return <AppRouterCacheProvider><AppThemeContext.Provider value={contextValue}><ThemeProvider theme={theme}><CssBaseline />{children}</ThemeProvider></AppThemeContext.Provider></AppRouterCacheProvider>;
}

export function AppThemeModeToggleButton() {
    const { mode, toggle } = useAppThemeMode();
    return <Tooltip title={"Toggle colour theme"}><IconButton onClick={toggle} color={"inherit"} aria-label={"Toggle colour theme"}>{mode === "dark" ? <LightModeOutlined /> : <DarkModeOutlined />}</IconButton></Tooltip>;
}
