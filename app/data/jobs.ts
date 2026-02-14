export interface Job {
  id: number;
  lang: string;
  title: string;
  overview: string;
  opportunities: number;
  type: number; // 1 -> Full Time, 2 -> Part Time, 3 -> Internship
  deadline: number; // millisecond timestamp
  description: string;
  requirements: string; // JSON string
  duties: string; // JSON string
  expectations: string; // JSON string
  experience: string;
  notes: string;
}

export const JOB_TYPES = {
  1: "full_time",
  2: "part_time",
  3: "internship",
} as const;

export type JobTypeKey = keyof typeof JOB_TYPES;
