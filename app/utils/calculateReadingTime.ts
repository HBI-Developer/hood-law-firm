export default function calculateReadingTime(contentJson: string): number {
  try {
    const doc = JSON.parse(contentJson);
    let wordCount = 0;

    const countWords = (nodes: any[]) => {
      for (const node of nodes) {
        if (node.type === "text" && node.text) {
          wordCount += node.text.trim().split(/\s+/).length;
        }
        if (node.content) {
          countWords(node.content);
        }
      }
    };

    if (doc.content) {
      countWords(doc.content);
    }

    return Math.max(1, Math.ceil(wordCount / 200));
  } catch (e) {
    return 1;
  }
}
