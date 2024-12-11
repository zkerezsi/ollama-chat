import { render, useCallback, useState } from "jsr:@hono/hono/jsx/dom";

import { useMdToHtml } from "./hooks/useMdToHtml.tsx";
import { Html } from "./components/Html.tsx";

function Chat() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [isInprogress, setInProgress] = useState(false);
  const [ac, setAc] = useState<AbortController | null>(null);
  const html = useMdToHtml(answer);

  const sendQuestion = useCallback(async () => {
    setInProgress(true);
    setAnswer("");

    const url = `/chat?q=${encodeURIComponent(question)}`;
    setQuestion("");
    const ac = new AbortController();
    setAc(ac);

    try {
      const res = await fetch(url, {
        method: "POST",
        signal: ac.signal,
      });

      const decoder = new TextDecoder();
      for await (const chunk of res.body!) {
        setAnswer(
          (current) => (current += decoder.decode(chunk, { stream: true }))
        );
      }
    } catch (err) {
      if ((err as Error).name !== "AbortError") throw err;
    } finally {
      setInProgress(false);
    }
  }, [question]);

  return (
    <>
      <div class="py-3 answer h-full">
        <Html content={html} />
      </div>
      <form
        onSubmit={
          isInprogress
            ? (e) => {
                e.preventDefault();
                ac!.abort();
              }
            : (e) => {
                e.preventDefault();
                sendQuestion();
              }
        }
        class="flex"
      >
        <input
          type="text"
          value={question}
          onChange={(e) => setQuestion((e.target as HTMLInputElement).value)}
          placeholder="> Enter your question"
          class="border border-slate-900 rounded py-2 px-4 w-full focus:outline-none bg-slate-700 mr-1 text-slate-100 placeholder-slate-300"
        />
        <button
          type="submit"
          class={`border border-slate-900  text-slate-100 rounded py-2 px-6 focus:outline-none ml-1 font-bold ${
            isInprogress
              ? "bg-rose-600 hover:bg-rose-700"
              : "bg-cyan-600 hover:bg-cyan-700"
          }`}
        >
          {isInprogress ? "Cancel" : "Send"}
        </button>
      </form>
    </>
  );
}

render(<Chat />, document.getElementById("root")!);
