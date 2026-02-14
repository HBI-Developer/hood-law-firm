export default function getArticleSummary(contentJson: string) {
  try {
    const doc = JSON.parse(contentJson);
    if (!doc || doc.type !== "doc" || !Array.isArray(doc.content)) {
      return contentJson;
    }

    const textParts: string[] = [];
    for (const node of doc.content) {
      if (node.type === "paragraph" && Array.isArray(node.content)) {
        const paragraphText = node.content
          .map((c: any) => (c.type === "text" ? c.text : ""))
          .join("");
        if (paragraphText.trim()) {
          textParts.push(paragraphText.trim());
        }
      }
      if (textParts.length >= 3) break;
    }

    if (textParts.length === 0) {
      return doc.content
        .flatMap((node: any) => node.content || [])
        .map((c: any) => (c.type === "text" ? c.text : ""))
        .join(" ")
        .slice(0, 200);
    }

    return textParts.join(" ");
  } catch (e) {
    return contentJson;
  }
}
