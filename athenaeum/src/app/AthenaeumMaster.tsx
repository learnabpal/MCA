import AppIcon from "@/app/bgc_apxdgtl.png";
import { DateTimeFormatter, Instant, ZoneId } from "@js-joda/core";
import { Locale } from "@js-joda/locale_en";
import CameraAltOutlined from "@mui/icons-material/CameraAltOutlined";
import EcoOutlined from "@mui/icons-material/EnergySavingsLeafOutlined";
import HistoryOutlined from "@mui/icons-material/HistoryOutlined";
import RecyclingOutlined from "@mui/icons-material/RecyclingOutlined";
import ShieldOutlined from "@mui/icons-material/ShieldOutlined";
import TravelExploreOutlined from "@mui/icons-material/TravelExploreOutlined";
import React from "react";




export type Sem = "sem1" | "sem2" | "sem3" | "sem4";
export const SUB_MAP = {
	  pc: "Programming Concept",
	  dsa: "Data Structure and Algorithm",
	  coa: "Computer Organisation and Architecture",
	  bmc: "Basic Mathematics for Computing",
	  ecom: "E-Commerce and Digital Business",
	  
	  rdbms: "Database Management System",
	  os: "Operating System",
	  oopj: "Object Oriented Programming with Java",
	  prst: "Probability and Statistics",
	  
	  sweng: "Software Engineering",
	  webt: "Web Technology"
} as const;
export type SubKey = keyof typeof SUB_MAP;
export const SUBS: Readonly<Record<Sem, SubKey[]>> = {
	  sem1: [ "pc", "dsa", "coa", "bmc", "ecom" ],
	  sem2: [],
	  sem3: [],
	  sem4: []
};
export type AthRtdbMap = {
	  subject: Record<SubKey, {
			 contents?: { [fs_key: string]: string }
			 downloads?: { [rtdb_key: string]: AthDownload }
	  }>
};

export type AthContent = {
	  sub: SubKey,
	  tags: string[],
	  title: string,
	  content: string,
};
export type AthDownload = {
	  title: string,
	  url: string
};


export {
	  AppIcon,
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

export const APP_NAME = "Athenaeum";
export const APP_TAGLINE = "MCA Mate";
export const BGC_NAME = "Bhawanipur Global Campus";
export const DEV_NAME = "Arnab Pal | apxdgtl";
export const HISTORY_KEY = "athenaeum-local-history";
export const MAX_IMAGE_BYTES = 15 * 1024 * 1024;
export const DATE_FORMAT = DateTimeFormatter.ofPattern("d MMM yyyy, HH:mm").withLocale(Locale.ENGLISH);
export const formatTimestamp = (at: string) => Instant.parse(at).atZone(ZoneId.systemDefault()).format(DATE_FORMAT);
