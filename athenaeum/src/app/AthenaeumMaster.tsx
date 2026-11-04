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
import SchoolOutlinedIcon from "@mui/icons-material/School";
import React from "react";




export const ASSET_MAP = {
	  sdm: "Study Materials",
	  res: "Resources",
	  asn: "Assignments",
	  qna: "Questions & Answers",
	  xxx: "Others"
};
export type AssetKey = keyof typeof ASSET_MAP;

export type Sem = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;
export const SUB_MAP = {
	  pc: "Programming Concept",
	  dsa: "Data Structure and Algorithm",
	  coa: "Computer Organisation and Architecture",
	  bmc: "Basic Mathematics for Computing",
	  ecom: "E-Commerce and Digital Business"
	  
	  // rdbms: "Database Management System",
	  // os: "Operating System",
	  // oopj: "Object Oriented Programming with Java",
	  // prst: "Probability and Statistics",
	  //
	  // sweng: "Software Engineering",
	  // webt: "Web Technology"
} as const;
export type SubKey = keyof typeof SUB_MAP;

export const getSubjectSets = () => {
	  const x = Object.entries(SUB_MAP).reduce((acc, [ key, title ]) => {
			 const f = title[0]?.toUpperCase() || "#";
			 if ( /*NOT->*/ ! acc[f]) acc[f] = {};
			 acc[f][key] = title;
			 return acc;
	  }, {} as Record<string, Record<SubKey, string>>);
	  return Object.entries(x).sort(([ f1, v1 ], [ f2, v2 ]) => f1.localeCompare(f2));
};

export const SPCL_MAP = {
	  core: "Core",
	  aiml: "Artificial Intelligence & Machine Learning",
	  ds: "Data Science",
	  iot: "Internet of Things",
	  robo: "Robotics"
} as const;
export type SpclKey = keyof typeof SPCL_MAP;

export type Course = {
	  titles: { abbr: string, full: string },
	  spcl: SpclKey[],
	  subs: Partial<Record<Sem, SubKey[]>>,
}
export type CrsKey = "mca";
export const COURSES: Record<CrsKey, Course> = {
	  mca: {
			 titles: { abbr: "MCA", full: "Master of Computer Applications" },
			 spcl: [ "aiml", "ds", "iot" ],
			 subs: {
					1: [ "pc", "dsa", "coa", "bmc", "ecom" ],
					2: [],
					3: [],
					4: []
			 }
	  }
} as const;

export const getCourseSets = () => {
	  const x = Object.entries(COURSES).reduce((acc, [ key, { titles, spcl } ]) => {
			 const f = titles.full[0]?.toUpperCase() || "#";
			 if ( /*NOT->*/ ! acc[f]) acc[f] = {};
			 acc[f][key] = { titles, spcl };
			 return acc;
	  }, {} as Record<string, Record<CrsKey, Pick<Course, "titles" | "spcl">>>);
	  return Object.entries(x).sort(([ f1, v1 ], [ f2, v2 ]) => f1.localeCompare(f2));
};

export type AthRtdbMap = {
	  subject: Partial<Record<SubKey, {
			 contents?: { [fs_key: string]: string }
			 downloads?: { [rtdb_key: string]: AthDownload }
	  }>>
};
type AthKeys = { sub: SubKey, ast: AssetKey };
export type AthContent = AthKeys & { tags: string[], title: string, content: string, };
export type AthDownload = AthKeys & { title: string, url: string };


export {
	  GitHubIcon, MenuBookOutlinedIcon, PictureAsPdfOutlinedIcon, DownloadIcon, FullscreenIcon, FileIcon,
	  ArrowBackRoundedIcon, ArrowForwardRoundedIcon,
	  AppIcon
};


export const APP_NAME = "Athenaeum";
export const APP_TAGLINE = "BGCites' Buddy";
export const BGC_NAME = "Bhawanipur Global Campus";
export const BGC_HEX_M = "#500000";
export const BGC_HEX_O = "#FF8000";
export const DEV_NAME = "Arnab Pal";
export const GITHUB_REPOSITORY_URL = "https://github.com/learnabpal/MCA";
export const HISTORY_KEY = "athenaeum-local-history";
export const MAX_FILE_MB = 25;
export const MAX_FILE_BYTES = MAX_FILE_MB * 1024 * 1024;
export const DATE_FORMAT = DateTimeFormatter.ofPattern("d MMM yyyy, HH:mm").withLocale(Locale.ENGLISH);
export const formatTimestamp = (at: string) => Instant.parse(at).atZone(ZoneId.systemDefault()).format(DATE_FORMAT);

export const NAV_ITEMS = {
	  home: { label: "Home", href: "/", icon: <HomeIcon fontSize={ "small" }/>, desc: `Return to the ${ APP_NAME } homepage.` },
	  courses: { label: "Courses", href: "/courses", icon: <SchoolOutlinedIcon fontSize={ "small" }/>, desc: "Browse courses and their subjects." },
	  subjects: { label: "Subjects", href: "/subjects", icon: <MenuBookOutlinedIcon fontSize={ "small" }/>, desc: "Browse subjects by semester and access their topics and available downloads." }
	  // github: { label: "GitHub", href: "/github", icon: <GitHubIcon fontSize={ "small" }/>, desc: "Explore the MCA monorepo and all its project files." }
} as const;


export const ENTRY_MODES = [ "content", "download" ] as const;
export type EntryMode = typeof ENTRY_MODES[number];
export const DL_TYPES = [ "file", "url" ] as const;
export type DownloadType = typeof DL_TYPES[number];
export const EXTS = [
	  ".jpg", ".jpeg", ".png", ".gif", ".webp",
	  ".pdf",
	  ".doc", ".docx", ".xls", ".xlsx", ".ppt", ".pptx",
	  ".md", ".txt"
] as const;

export const joiner = (...str: string[]) => str.join("/");
const opacity = 0.75;
export { opacity };
