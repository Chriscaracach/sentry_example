import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";

export default function CodeSlide({ slide }) {
  return (
    <div className="slide">
      <div className="code-block">
        <SyntaxHighlighter
          language="javascript"
          style={vscDarkPlus}
          customStyle={{
            margin: 0,
            borderRadius: "8px",
            fontSize: "1.5rem",
            lineHeight: "1.75",
          }}
        >
          {slide.code}
        </SyntaxHighlighter>
      </div>
    </div>
  );
}
