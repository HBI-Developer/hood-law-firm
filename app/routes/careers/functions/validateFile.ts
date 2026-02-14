import { MAXIMUM_PDF_RESUME_SIZE } from "~/constants";
import { isPDF } from "./isPDF";

export default async function validateFile(file: File, size?: number) {
  if (file.size > (size || MAXIMUM_PDF_RESUME_SIZE) * 1024 * 1024) {
    return "file_too_large";
  }

  const validPDF = await isPDF(file);
  if (!validPDF) {
    return "invalid_file_type";
  }
  return null;
}
