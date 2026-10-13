import AppThemeModeProvider from "@/components/mui/apx/tsx/AppThemeModeProvider";
import React from "react";

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
    return <html lang={"en-GB"}><body><AppThemeModeProvider>{children}</AppThemeModeProvider></body></html>;
}
