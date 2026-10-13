import { formatTo_dd_MMM_yyyy } from "@/components/apx/ts/DTF";
import { PortfolioModel, TextModel } from "@/firebase-ts/Models";
import { ChronoUnit, LocalDate } from "@js-joda/core";




export type GraphDataType = {
	  x: string;
	  y: number;
	  fill: string;
	  icon?: string | undefined;
}

export const horizontalPaddingGenerator = (data: GraphDataType[]) => data.reduce((max, obj) => Math.max(max, obj.x.length), 0) / 3;

export const AGE = ChronoUnit.YEARS.between(LocalDate.parse("1986-12-26"), LocalDate.now());


export function generateDataFromPortfolioModel(portfolioModel: PortfolioModel) {
	  
	  if (/*FALSY->*/ !!! portfolioModel) return;
	  
	  const HANDS_ON_LANGUAGES_DATA = Object.entries(portfolioModel.handsOn.languages)
														 .sort(([ , a ], [ , b ]) => a.order - b.order)
														 .reduce((acc, [ name, lfm ]) => {
																const obj = {
																	  x: name,
																	  y: lfm.percentage,
																	  fill: portfolioModel.proficiencies.languages[name].colour,
																	  icon: "language-" + name
																};
																acc.push(obj);
																return acc;
														 }, [] as GraphDataType[]);
	  
	  const HANDS_ON_FRAMEWORKS_DATA = Object.entries(portfolioModel.handsOn.frameworks)
														  .sort(([ , a ], [ , b ]) => a.order - b.order)
														  .reduce((acc, [ name, lfm ]) => {
																 const obj = {
																		x: name,
																		y: lfm.percentage,
																		fill: portfolioModel.proficiencies.frameworks[name].colour
																 };
																 acc.push(obj);
																 return acc;
														  }, [] as GraphDataType[]);
	  
	  const PROFICIENCIES_LANGUAGES_DATA = Object.entries(portfolioModel.proficiencies.languages)
																.sort(([ , a ], [ , b ]) => a.order - b.order)
																.reduce((acc, [ name, lfm ]) => {
																	  const obj = {
																			 x: name,
																			 y: lfm.percentage,
																			 fill: lfm.colour,
																			 icon: "language-" + name
																	  };
																	  acc.push(obj);
																	  return acc;
																}, [] as GraphDataType[]);
	  
	  const PROFICIENCIES_FRAMEWORKS_DATA = Object.entries(portfolioModel.proficiencies.frameworks)
																 .sort(([ , a ], [ , b ]) => a.order - b.order)
																 .reduce((acc, [ name, lfm ]) => {
																		const obj = {
																			  x: name,
																			  y: lfm.percentage,
																			  fill: lfm.colour
																		};
																		acc.push(obj);
																		return acc;
																 }, [] as GraphDataType[]);
	  
	  const RELEVANT_COURSERA_EDUCATION_DATA = Object.entries(portfolioModel.relevant.education.certificates.coursera ?? {})
																	 .filter(([ _, { include } ]) => include)
																	 .map(([ credential, { attestation, acquisition } ], order) => ({ text: credential + " (" + formatTo_dd_MMM_yyyy(LocalDate.parse(acquisition)) + ")", url: attestation, order } as TextModel));
	  
	  const RELEVANT_WORK_DATA = Object.values(portfolioModel.relevant.work ?? {})
												  .sort((a, b) => a.order - b.order);
	  
	  const PHILOSOPHIES_DATA = Object.values(portfolioModel.philosophies)
												 .map(({ text, title }, order) => ({ url: title, text, order } as TextModel))
												 .sort((a, b) => a.order - b.order);
	  
	  const HEADER = portfolioModel.header;
	  
	  const CONTACT = portfolioModel.contact;
	  
	  return {
			 HANDS_ON_LANGUAGES_DATA,
			 HANDS_ON_FRAMEWORKS_DATA,
			 PROFICIENCIES_LANGUAGES_DATA,
			 PROFICIENCIES_FRAMEWORKS_DATA,
			 RELEVANT_COURSERA_EDUCATION_DATA,
			 RELEVANT_WORK_DATA,
			 PHILOSOPHIES_DATA,
			 HEADER,
			 CONTACT
	  };
	  
}

