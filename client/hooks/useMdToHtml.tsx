import { Marked } from "npm:marked";
import { markedHighlight } from "npm:marked-highlight";
import hljs from "npm:highlight.js";
import { useEffect, useState } from "npm:hono/jsx/dom";

const marked = new Marked(
  markedHighlight({
    emptyLangClass: "hljs",
    langPrefix: "hljs language-",
    highlight(code, lang, _) {
      const language = hljs.getLanguage(lang) ? lang : "plaintext";
      return hljs.highlight(code, { language }).value;
    },
  })
);

export function useMdToHtml(markdownString: string) {
  const [htmlString, setHtmlString] = useState("");

  useEffect(() => {
    marked
      .parse(markdownString, { async: true })
      .then((html: string) => setHtmlString(html));
  }, [markdownString]);

  return htmlString;
}
