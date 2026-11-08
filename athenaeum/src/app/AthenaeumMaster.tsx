import AppIcon from "@/app/bgc_apxdgtl.png";
import { CrsKey, SpclKey, SubKey } from "@/app/BgcMaster";
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


// Added check to ensure course.spcl and course.subs[sem][spcl] matches
export const revalSpcl = (crs_spcl: SpclKey[], spcl: SpclKey) => ([ ...crs_spcl, "core" ] as SpclKey[]).includes(spcl);


export const ASSET_MAP = {
	  asn: "Assignments",
	  qna: "Questions & Answers",
	  res: "Resources",
	  sdm: "Study Materials",
	  sgn: "Suggestions",
	  xxx: "Others"
};
export type AssetKey = keyof typeof ASSET_MAP;

type AthKeys = { sub: SubKey, ast: AssetKey };

export type AthContent = AthKeys & { tags: string[], title: string, content: string, };
export type AthDownload = AthKeys & { title: string, url: string };
export type AthRtdbMap = {
	  subject: Partial<Record<SubKey, {
			 contents?: { [fs_key: string]: string }
			 downloads?: { [rtdb_key: string]: AthDownload }
	  }>>
};

export type BgcId = { bgcId: string }
export type AthBuilderMeta = { crs: CrsKey, spcl?: SpclKey, email: string } & BgcId


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

export const UI_TEXTS = {
	  subjects: "Select a subject to view its available study materials and downloads.",
	  courses: "Select a course to view its available semester-wise subjects.",
	  subject: "Browse the available content and subject resources."
};
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
