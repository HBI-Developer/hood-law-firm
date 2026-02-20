export async function isPDF(file: File): Promise<boolean> {
  if (!file) return false;

  if (!file.name.toLowerCase().endsWith(".pdf")) return false;

  try {
    const buffer = await file.slice(0, 5).arrayBuffer(),
      header = new Uint8Array(buffer),
      signature = Array.from(header)
        .map((byte) => String.fromCharCode(byte))
        .join("");
    return signature === "%PDF-";
  } catch (error) {
    console.error("Error validating PDF signature:", error);
    return false;
  }
}
