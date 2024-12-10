import { Ollama } from "npm:ollama";
import { Hono } from "npm:hono";
import { streamText } from "npm:hono/streaming";
import { serveStatic } from "npm:hono/deno";
import { jsxRenderer } from "npm:hono/jsx-renderer";

import { HomePage } from "./pages/HomePage.tsx";

const ollama = new Ollama({ host: "http://127.0.0.1:11434" });
const hono = new Hono();

hono.use(jsxRenderer());

hono.use("/static/*", serveStatic({ root: "./" }));

hono.get("/", (c) => c.render(<HomePage />));

hono.post("/chat", (c) =>
  streamText(c, async (stream) => {
    const { q } = c.req.query();

    const chatResponse = await ollama.chat({
      model: "llama3.1",
      messages: [
        {
          role: "user",
          content: q,
        },
      ],
      stream: true,
    });

    for await (const chunk of chatResponse) {
      await stream.write(chunk.message.content);
    }
  })
);

Deno.serve(hono.fetch);
