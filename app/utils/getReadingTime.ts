import type { Locale } from "~/constants";

export default function getReadingTime(time: number, lang: Locale) {
  switch (lang) {
    case "ar": {
      if (time === 1) {
        return `دقيقة واحدة للقراءة`;
      } else if (time === 2) {
        return `دقيقتان للقراءة`;
      } else if (time > 2 && time < 11) {
        return `${time} دقائق للقراءة`;
      } else {
        return `${time} دقيقة للقراءة`;
      }
    }

    case "en": {
      if (time === 1) {
        return `One Minute to Read`;
      } else {
        return `${time} Minutes to Read`;
      }
    }
  }
}
