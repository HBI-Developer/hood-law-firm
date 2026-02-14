import type { Locale } from "~/constants";

export default function getOpportunities(opportunities: number, lang: Locale) {
  switch (lang) {
    case "ar": {
      if (opportunities === 1) {
        return `فرصة واحدة`;
      } else if (opportunities === 2) {
        return `فرصتان`;
      } else if (opportunities > 2 && opportunities < 11) {
        return `${opportunities} فرص`;
      } else {
        return `${opportunities} فرصة`;
      }
    }

    case "en": {
      if (opportunities === 1) {
        return "One opportunity";
      } else {
        return `${opportunities} opportunities`;
      }
    }
  }
}
