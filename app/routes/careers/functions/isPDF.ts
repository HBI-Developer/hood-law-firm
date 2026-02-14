/**
 * Checks if a file is a valid PDF by inspecting its magic numbers (PDF signature).
 * A PDF file starts with '%PDF-'.
 * @param file The file to check.
 * @returns A promise that resolves to true if the file is a PDF, false otherwise.
 */
export async function isPDF(file: File): Promise<boolean> {
  if (!file) return false;

  // Check file extension first as a quick filter
  if (!file.name.toLowerCase().endsWith(".pdf")) return false;

  try {
    const buffer = await file.slice(0, 5).arrayBuffer();
    const header = new Uint8Array(buffer);
    const signature = Array.from(header)
      .map((byte) => String.fromCharCode(byte))
      .join("");
    return signature === "%PDF-";
  } catch (error) {
    console.error("Error validating PDF signature:", error);
    return false;
  }
}
