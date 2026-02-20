import type { SUPPORTED_LANGUAGES } from "./constants";

declare global {
  export type Locale = keyof typeof SUPPORTED_LANGUAGES;

  export interface Job {
    id: number;
    lang: string;
    title: string;
    overview: string;
    opportunities: number;
    type: number; // 1 -> Full Time, 2 -> Part Time, 3 -> Internship
    deadline: number;
    description: string;
    requirements: string;
    duties: string;
    expectations: string;
    experience: string;
    notes: string;
  }
}

export default global;
