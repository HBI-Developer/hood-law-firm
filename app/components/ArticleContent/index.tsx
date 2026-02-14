export default function ArticleContent({
  contentJson,
}: {
  contentJson: string;
}) {
  try {
    const doc = JSON.parse(contentJson);

    if (!doc || doc.type !== "doc" || !Array.isArray(doc.content)) {
      return <div className="prose max-w-none">{contentJson}</div>;
    }

    const renderMarks = (text: string, marks: any[] = []): React.ReactNode => {
      if (!marks || marks.length === 0) return text;

      let result: React.ReactNode = text;

      marks.forEach((mark, idx) => {
        const key = `mark-${idx}`;
        switch (mark.type) {
          case "bold":
            result = <strong key={key}>{result}</strong>;
            break;
          case "italic":
            result = <em key={key}>{result}</em>;
            break;
          case "underline":
            result = <u key={key}>{result}</u>;
            break;
          case "strike":
            result = <s key={key}>{result}</s>;
            break;
          case "code":
            result = (
              <code
                key={key}
                className="bg-gray-100 px-1.5 py-0.5 rounded text-sm font-mono"
              >
                {result}
              </code>
            );
            break;
          case "link":
            result = (
              <a
                key={key}
                href={mark.attrs?.href}
                target={mark.attrs?.target}
                className="text-side-2 hover:text-side-1 underline"
              >
                {result}
              </a>
            );
            break;
          case "textStyle":
            const style: React.CSSProperties = {};
            if (mark.attrs?.color) {
              style.color = mark.attrs.color;
            }
            if (mark.attrs?.fontSize) {
              style.fontSize = mark.attrs.fontSize;
            }
            result = (
              <span key={key} style={style}>
                {result}
              </span>
            );
            break;
          case "highlight":
            result = (
              <mark
                key={key}
                style={{
                  backgroundColor: mark.attrs?.color || "#ffeb3b",
                }}
              >
                {result}
              </mark>
            );
            break;
        }
      });

      return result;
    };

    const renderNode = (node: any, index: number): React.ReactNode => {
      const key = `node-${index}`;

      switch (node.type) {
        case "paragraph":
          const textAlign = node.attrs?.textAlign || "left";
          return (
            <p
              key={key}
              className="mb-4 text-gray-800 leading-relaxed"
              style={{ textAlign }}
            >
              {node.content?.map((c: any, i: number) => renderNode(c, i)) || (
                <br />
              )}
            </p>
          );

        case "heading":
          const level = node.attrs?.level || 1;
          const Tag = `h${level}` as keyof React.JSX.IntrinsicElements;
          const headingClasses = {
            h1: "text-3xl font-bold mb-6 mt-8 text-secondary",
            h2: "text-2xl font-bold mb-5 mt-6 text-secondary",
            h3: "text-xl font-bold mb-4 mt-5 text-secondary",
            h4: "text-base font-bold mb-3 mt-4 text-gray-800",
            h5: "text-sm font-bold mb-3 mt-3 text-gray-800",
            h6: "text-xs font-bold mb-2 mt-2 text-gray-800",
          };
          return (
            <Tag
              key={key}
              className={
                headingClasses[Tag as keyof typeof headingClasses] || ""
              }
              style={{ textAlign: node.attrs?.textAlign || "left" }}
            >
              {node.content?.map((c: any, i: number) => renderNode(c, i))}
            </Tag>
          );

        case "text":
          return renderMarks(node.text, node.marks);

        case "hardBreak":
          return <br key={key} />;

        case "bulletList":
          return (
            <ul
              key={key}
              className="list-disc ms-6 mb-4 space-y-1 text-gray-800"
            >
              {node.content?.map((c: any, i: number) => renderNode(c, i))}
            </ul>
          );

        case "orderedList":
          return (
            <ol
              key={key}
              className="list-decimal ms-6 mb-4 space-y-1 text-gray-800"
              start={node.attrs?.start || 1}
            >
              {node.content?.map((c: any, i: number) => renderNode(c, i))}
            </ol>
          );

        case "listItem":
          return (
            <li key={key} className="mb-1">
              {node.content?.map((c: any, i: number) => renderNode(c, i))}
            </li>
          );

        case "blockquote":
          return (
            <blockquote
              key={key}
              className="border-s-4 border-side-2 ps-4 py-2 mb-4 italic text-gray-700 bg-gray-50"
            >
              {node.content?.map((c: any, i: number) => renderNode(c, i))}
            </blockquote>
          );

        case "codeBlock":
          return (
            <pre
              key={key}
              className="bg-gray-900 text-gray-100 p-4 rounded-lg mb-4 overflow-x-auto"
            >
              <code className="font-mono text-sm">
                {node.content?.map((c: any) => c.text).join("") || ""}
              </code>
            </pre>
          );

        case "horizontalRule":
          return <hr key={key} className="my-8 border-gray-300" />;

        case "image":
          return (
            <img
              key={key}
              src={node.attrs?.src}
              alt={node.attrs?.alt || ""}
              title={node.attrs?.title}
              className="max-w-full h-auto rounded-lg my-6"
            />
          );

        default:
          return null;
      }
    };

    return (
      <div className="prose prose-lg max-w-none">
        {doc.content.map((node: any, i: number) => renderNode(node, i))}
      </div>
    );
  } catch (e) {
    console.log(e);

    return <div className="prose max-w-none">{contentJson}</div>;
  }
}
