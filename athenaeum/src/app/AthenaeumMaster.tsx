import AppIcon from "@/app/bgc_apxdgtl.png";
import { DateTimeFormatter, Instant, ZoneId } from "@js-joda/core";
import { Locale } from "@js-joda/locale_en";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import FileIcon from "@mui/icons-material/Description";
import DownloadIcon from "@mui/icons-material/Download";
import FullscreenIcon from "@mui/icons-material/Fullscreen";
import GitHubIcon from "@mui/icons-material/GitHub";
import HomeIcon from "@mui/icons-material/Home";
import MenuBookOutlinedIcon from "@mui/icons-material/MenuBook";
import PictureAsPdfOutlinedIcon from "@mui/icons-material/PictureAsPdfOutlined";
import React from "react";




export type Sem = "sem1" | "sem2" | "sem3" | "sem4";
export const SUB_MAP = {
	  pc: "Programming Concept",
	  dsa: "Data Structure and Algorithm",
	  coa: "Computer Organisation and Architecture",
	  bmc: "Basic Mathematics for Computing",
	  ecom: "E-Commerce and Digital Business",
	  
	  // rdbms: "Database Management System",
	  // os: "Operating System",
	  // oopj: "Object Oriented Programming with Java",
	  // prst: "Probability and Statistics",
	  //
	  // sweng: "Software Engineering",
	  // webt: "Web Technology"
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


export {
	  GitHubIcon, MenuBookOutlinedIcon, PictureAsPdfOutlinedIcon, DownloadIcon, FullscreenIcon, FileIcon,
	  ArrowBackRoundedIcon, ArrowForwardRoundedIcon,
	  AppIcon
};


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


export const NAV_ITEMS = {
	  home: { label: "Home", href: "/", icon: <HomeIcon fontSize={ "small" }/>, desc: `Return to the ${ APP_NAME } homepage.` },
	  subjects: { label: "Subjects", href: "/subjects", icon: <MenuBookOutlinedIcon fontSize={ "small" }/>, desc: "Browse subjects by semester and access their topics and available downloads." },
	  github: { label: "GitHub", href: "/github", icon: <GitHubIcon fontSize={ "small" }/>, desc: "Explore the MCA monorepo and all its project files." }
} as const;
