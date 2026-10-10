import { Credential } from "@/components/apx/tsx/APXCourseraTracker";




export type LangFwModel = {
	  colour: string;
	  percentage: number;
	  order: number;
};

export type TextModel = {
	  text: string;
	  url?: string;
	  order: number;
};


export type PortfolioModel = {
	  contact: { email: string, phone: string },
	  header: string,
	  philosophies: { [order: number]: { title: string, text: string } };
	  handsOn: {
			 languages: { [Name: string]: Omit<LangFwModel, "colour"> },
			 frameworks: { [Name: string]: Omit<LangFwModel, "colour"> },
	  },
	  proficiencies: {
			 languages: { [Name: string]: LangFwModel },
			 frameworks: { [Name: string]: LangFwModel },
	  },
	  /* SHOW_OFF_LINKS: {
			 [NAME: string]: TextModel
	  },
	  KEYNOTES: {
			 [NAME: string]: TextModel
	  }, */
	  relevant: {
			 education: {
					certificates: {
						  coursera: { [credential: string]: Pick<Credential, "attestation" | "acquisition"> & { include?: boolean } }
					}
			 };
			 work?: { [NAME: string]: TextModel };
	  }
};

export type ResumeRatingFeedbackModel = {
	  name: string,
	  contact: string,
	  rating: number,
	  feedback: string,
	  visitedAt: number,
}

export type FirebaseDataModel = ResumeRatingFeedbackModel;

export const rfKeys = { name: "name", contact: "contact", rating: "rating", feedback: "feedback", visitedAt: "visitedAt" } as const;

export const firebaseModelKeys = {
	  ...rfKeys
} as const;
