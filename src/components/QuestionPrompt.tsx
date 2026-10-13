import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

/** Question text with markdown support, so calculation questions can include load-chart tables. */
export function QuestionPrompt({ number, text }: { number: number; text: string }) {
  return (
    <div className="flex gap-2 font-semibold">
      <span>{number}.</span>
      <div className="prose-lesson prose-question min-w-0 flex-1">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{text}</ReactMarkdown>
      </div>
    </div>
  );
}
