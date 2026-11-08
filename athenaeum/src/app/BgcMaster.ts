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
	  aiml: "Artificial Intelligence & Machine Learning",
	  avhm: "Aviation Hospitality Services & Management",
	  bfin: "Banking & Finance",
	  clps: "Clinical Psychology",
	  core: "Core",
	  culs: "Culinary Science",
	  cyse: "Cyber Security",
	  dscs: "Data Science & Cyber Security",
	  dtsa: "Data Science & Analytics",
	  dtsc: "Data Science",
	  entr: "Entrepreneurship",
	  fash: "Fashion Design & Management",
	  glob: "Global Business",
	  hspm: "Hospitality Management",
	  hha: "Hospitality & Hotel Administration",
	  hosp: "Hospitality Management",
	  intr: "Interior Designing",
	  iots: "Internet of Things",
	  mmag: "Multimedia, Animation & Graphics",
	  mdsc: "Media Science",
	  phceu: "Pharmaceutics",
	  phcol: "Pharmacology",
	  robo: "Robotics",
	  sprt: "Sports Management",
	  trav: "Travel & Tourism Management"
} as const;

export type SpclKey = keyof typeof SPCL_MAP;

export type Course = {
	  titles: { abbr: string, full: string },
	  spcl: SpclKey[],
	  subs: Partial<Record<Sem, Partial<Record<SpclKey, SubKey[]>>>>,
}

export type CrsKey =
		  | "bba"
		  | "mba"
		  | "emba"
		  | "mha"
		  | "bpsy"
		  | "bnd"
		  | "bopt"
		  | "mnd"
		  | "mopt"
		  | "mph"
		  | "msc"
		  | "mpharm"
		  | "bpharm"
		  | "bsc"
		  | "bca"
		  | "mca"
		  | "mttm";
export const COURSES: Record<CrsKey, Course> = {
	  bba: {
			 titles: { abbr: "BBA", full: "Bachelor of Business Administration" },
			 spcl: [ "bfin", "entr", "hosp", "glob", "sprt", "trav", "avhm" ],
			 subs: {
					1: {}, 2: {}, 3: {}, 4: {}, 5: {}, 6: {}, 7: {}, 8: {}
			 }
	  },
	  bca: {
			 titles: { abbr: "BCA", full: "Bachelor of Computer Applications" },
			 spcl: [ "aiml", "dscs" ],
			 subs: {
					1: {}, 2: {}, 3: {}, 4: {}, 5: {}, 6: {}, 7: {}, 8: {}
			 }
	  },
	  bnd: {
			 titles: { abbr: "BND", full: "Bachelor of Nutrition & Dietetics" },
			 spcl: [],
			 subs: {
					1: {}, 2: {}, 3: {}, 4: {}, 5: {}, 6: {}, 7: {}, 8: {}
			 }
	  },
	  bopt: {
			 titles: { abbr: "BOptom", full: "Bachelor of Optometry" },
			 spcl: [],
			 subs: {
					1: {}, 2: {}, 3: {}, 4: {}, 5: {}, 6: {}, 7: {}, 8: {}
			 }
	  },
	  bpharm: {
			 titles: { abbr: "BPharm", full: "Bachelor of Pharmacy" },
			 spcl: [],
			 subs: {
					1: {}, 2: {}, 3: {}, 4: {}, 5: {}, 6: {}, 7: {}, 8: {}
			 }
	  },
	  bpsy: {
			 titles: { abbr: "BPsych", full: "Bachelor of Psychology" },
			 spcl: [],
			 subs: {
					1: {}, 2: {}, 3: {}, 4: {}, 5: {}, 6: {}, 7: {}, 8: {}
			 }
	  },
	  bsc: {
			 titles: { abbr: "BSc", full: "Bachelor of Science" },
			 spcl: [ "dtsc", "fash", "intr", "mmag", "hha", "culs", "mdsc" ],
			 subs: {
					1: {}, 2: {}, 3: {}, 4: {}, 5: {}, 6: {}, 7: {}, 8: {}
			 }
	  },
	  emba: {
			 titles: { abbr: "Exec. MBA", full: "Executive Master of Business Administration" },
			 spcl: [],
			 subs: {
					1: {}, 2: {}, 3: {}, 4: {}
			 }
	  },
	  mba: {
			 titles: { abbr: "MBA", full: "Master of Business Administration" },
			 spcl: [],
			 subs: {
					1: {}, 2: {}, 3: {}, 4: {}
			 }
	  },
	  mca: {
			 titles: { abbr: "MCA", full: "Master of Computer Applications" },
			 spcl: [ "dtsc", "cyse", "iots" ],
			 subs: {
					1: { core: [ "pc", "dsa", "coa", "bmc", "ecom" ] }, 2: {}, 3: {}, 4: {}
			 }
	  },
	  mha: {
			 titles: { abbr: "MHA", full: "Master of Hospital Administration" },
			 spcl: [],
			 subs: {
					1: {}, 2: {}, 3: {}, 4: {}
			 }
	  },
	  mnd: {
			 titles: { abbr: "MND", full: "Master of Nutrition & Dietetics" },
			 spcl: [],
			 subs: {
					1: {}, 2: {}, 3: {}, 4: {}
			 }
	  },
	  mopt: {
			 titles: { abbr: "MOptom", full: "Master of Optometry" },
			 spcl: [],
			 subs: {
					1: {}, 2: {}, 3: {}, 4: {}
			 }
	  },
	  mph: {
			 titles: { abbr: "MPH", full: "Master of Public Health" },
			 spcl: [],
			 subs: {
					1: {}, 2: {}, 3: {}, 4: {}
			 }
	  },
	  mpharm: {
			 titles: { abbr: "MPharm", full: "Master of Pharmacy" },
			 spcl: [ "phceu", "phcol" ],
			 subs: {
					1: {}, 2: {}, 3: {}, 4: {}
			 }
	  },
	  msc: {
			 titles: { abbr: "MSc", full: "Master of Science" },
			 spcl: [ "clps", "hspm", "mdsc", "mmag", "dtsa" ],
			 subs: {
					1: {}, 2: {}, 3: {}, 4: {}
			 }
	  },
	  mttm: {
			 titles: { abbr: "MTTM", full: "Master of Tourism & Travel Management" },
			 spcl: [],
			 subs: {
					1: {}, 2: {}, 3: {}, 4: {}
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

export const getCourseSubs = (crs: CrsKey) => {
	  return Object.entries(COURSES[crs].subs)
						.map(([ sem, spcl_sub_map ]) => Object.entries(spcl_sub_map).map(([ spcl, subs ]) => subs))
						.flat(2)
						.map(s => [ s, SUB_MAP[s] as const ]);
};
