import { render, useCallback, useState } from "npm:hono/jsx/dom";
import { useMdToHtml } from "./hooks/useMdToHtml.tsx";
import { Html } from "./components/Html.tsx";

function Chat() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const html = useMdToHtml(answer);

  const sendQuestion = useCallback(async () => {
    setAnswer("");
    const res = await fetch(`/chat?q=${encodeURIComponent(question)}`, {
      method: "POST",
    });

    const decoder = new TextDecoder();
    for await (const chunk of res.body!) {
      setAnswer(
        (current) => (current += decoder.decode(chunk, { stream: true }))
      );
    }
  }, [question]);

  return (
    <>
      <div class="py-3 answer h-full">
        <Html content={html} />
      </div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          sendQuestion();
          setQuestion("");
        }}
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
          class="border border-slate-900 bg-cyan-600 text-slate-100 rounded py-2 px-6 hover:bg-cyan-700 focus:outline-none ml-1 font-bold"
        >
          Send
        </button>
      </form>
    </>
  );
}

render(<Chat />, document.getElementById("root")!);
