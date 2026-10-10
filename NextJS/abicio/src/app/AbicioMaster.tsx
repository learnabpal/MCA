import { DateTimeFormatter, Instant, ZoneId } from "@js-joda/core";
import { Locale } from "@js-joda/locale_en";
import CameraAltOutlined from "@mui/icons-material/CameraAltOutlined";
import EcoOutlined from "@mui/icons-material/EnergySavingsLeafOutlined";
import HistoryOutlined from "@mui/icons-material/HistoryOutlined";
import RecyclingOutlined from "@mui/icons-material/RecyclingOutlined";
import ShieldOutlined from "@mui/icons-material/ShieldOutlined";
import TravelExploreOutlined from "@mui/icons-material/TravelExploreOutlined";
import React from "react";




export {
	  EcoOutlined, HistoryOutlined, RecyclingOutlined,
	  ShieldOutlined, TravelExploreOutlined
};


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

export const APP_NAME = "Abicio";
export const APP_TAGLINE = "Waste Intelligence";
export const HISTORY_KEY = "abicio-analysis-history";
export const MAX_IMAGE_BYTES = 15 * 1024 * 1024;
export const DATE_FORMAT = DateTimeFormatter.ofPattern("d MMM yyyy, HH:mm", Locale.ENGLISH);
export const formatTimestamp = (at: string) => Instant.parse(at).atZone(ZoneId.systemDefault()).format(DATE_FORMAT);

export const FEATURES = [
	  {
			 title: "Detect mixed waste",
			 description: "Identify multiple visible waste items in one photograph and view their predicted locations.",
			 icon: <CameraAltOutlined/>,
			 colour: "success" as const
	  },
	  {
			 title: "Get practical guidance",
			 description: "Turn detected labels into segregation, reuse, recycling and disposal suggestions.",
			 icon: <RecyclingOutlined/>,
			 colour: "info" as const
	  },
	  {
			 title: "Keep hazardous items separate",
			 description: "Surface special handling guidance for batteries and other waste that should not enter mixed household waste.",
			 icon: <ShieldOutlined/>,
			 colour: "warning" as const
	  }
];
