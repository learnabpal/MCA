import AppIcon from "@/app/bgc_apxdgtl.png";
import { DateTimeFormatter, Instant, ZoneId } from "@js-joda/core";
import { Locale } from "@js-joda/locale_en";
import EcoOutlined from "@mui/icons-material/EnergySavingsLeafOutlined";
import GitHub from "@mui/icons-material/GitHub";
import HistoryOutlined from "@mui/icons-material/HistoryOutlined";
import MenuBookOutlined from "@mui/icons-material/MenuBookOutlined";
import PictureAsPdfOutlined from "@mui/icons-material/PictureAsPdfOutlined";
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
	  subject: Partial<Record<SubKey, {
			 contents?: { [fs_key: string]: string }
			 downloads?: { [rtdb_key: string]: AthDownload }
	  }>>
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


export { GitHub, MenuBookOutlined, PictureAsPdfOutlined };
export {
	  AppIcon,
	  EcoOutlined, HistoryOutlined, RecyclingOutlined,
	  ShieldOutlined, TravelExploreOutlined
};


export const NAV_ITEMS = {
	  home: { label: "Home", href: "/", icon: <MenuBookOutlined fontSize={ "small" }/>, desc: "Return to the Athenaeum homepage." },
	  subjects: { label: "Subjects", href: "/subjects", icon: <MenuBookOutlined fontSize={ "small" }/>, desc: "Browse subjects by semester and access their topics and available downloads." },
	  github: { label: "GitHub", href: "/github", icon: <GitHub fontSize={ "small" }/>, desc: "Explore the MCA monorepo and all its project files." }
} as const;

export const APP_NAME = "Athenaeum";
export const APP_TAGLINE = "MCA Mate";
export const BGC_NAME = "Bhawanipur Global Campus";
export const BGC_HEX = "#800000";
export const DEV_NAME = "Arnab Pal | apxdgtl";
export const GITHUB_REPOSITORY_URL = "https://github.com/learnabpal/MCA";
export const HISTORY_KEY = "athenaeum-local-history";
export const MAX_IMAGE_BYTES = 15 * 1024 * 1024;
export const DATE_FORMAT = DateTimeFormatter.ofPattern("d MMM yyyy, HH:mm").withLocale(Locale.ENGLISH);
export const formatTimestamp = (at: string) => Instant.parse(at).atZone(ZoneId.systemDefault()).format(DATE_FORMAT);
