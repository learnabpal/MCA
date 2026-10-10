"use client"

import { APX_COLOURS, WEB_SUPPORT_WHATSAPP } from "@/components/ApxMaster";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import Fab from "@mui/material/Fab";
import Zoom from "@mui/material/Zoom";
import { alpha } from "@mui/material/styles";
import { log } from "console";
import { useParams, usePathname } from "next/navigation";
import { useRouter } from "next/router";
import React from "react";

export const WhatsappFAB = () => {
  // Always visible, no uid check required
  const [ visible, setVisible ] = React.useState<boolean>(true);
  const lastScrollY = React.useRef<number>(0);

  React.useEffect(() => {
    const handleScroll = () => {
      const current = window.scrollY;
      const delta = current - lastScrollY.current;
      setVisible(prev => {
        if (current <= 20) return true;
        if (delta > 10) return false;
        if (delta < -10) return true;
        return prev;
      });
      lastScrollY.current = current;
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <Zoom in={ visible }>
      <Fab
        color={ "inherit" }
        aria-label={ "WhatsApp Support" }
        href={ WEB_SUPPORT_WHATSAPP }
        target={ "_blank" }
        rel={ "noopener noreferrer" }
        sx={ {
          position: "fixed",
          bottom: 8,
          right: 8,
          zIndex: 1100,
          // background: "linear-gradient(135deg, #25D366 0%, #128C7E 100%)",
          background: APX_COLOURS.brand,
          color: "common.white",
          // "&:hover": {
          //   background: "linear-gradient(135deg, #128C7E 0%, #075E54 100%)",
          //   transform: "scale(1.1)"
          // },
          // transition: "all 0.3s ease-in-out"
          "&:hover": {
            background: "rgba(155, 0, 0, 1)",
          },
          transition: "all 0.3s ease-in-out",
        } }
      >
        <WhatsAppIcon fontSize={ "large" } />
      </Fab>
    </Zoom>
  );
};
