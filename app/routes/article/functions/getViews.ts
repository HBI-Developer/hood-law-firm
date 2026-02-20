export default function getViews(views: number, lang: Locale) {
  switch (lang) {
    case "ar": {
      if (views === 0) {
        return `ﻻ مشاهدات`;
      } else if (views === 1) {
        return `مشاهدة واحدة`;
      } else if (views === 2) {
        return `مشاهدتان`;
      } else if (views > 2 && views < 11) {
        return `${views} مشاهدات`;
      } else {
        return `${views} مشاهدة`;
      }
    }

    case "en": {
      if (views === 0) {
        return `No Views`;
      } else if (views === 1) {
        return `1 View`;
      } else {
        return `${views} Views`;
      }
    }
  }
}
