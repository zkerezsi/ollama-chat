import { Ollama } from "npm:ollama";
import { Hono } from "jsr:@hono/hono";
import { streamText } from "jsr:@hono/hono/streaming";
import { serveStatic } from "jsr:@hono/hono/deno";
import { jsxRenderer } from "jsr:@hono/hono/jsx-renderer";
import * as log from "jsr:@std/log";
import { Database } from "jsr:@db/sqlite";

import { HomePage } from "./pages/HomePage.tsx";

log.setup({
  handlers: {
    default: new log.ConsoleHandler("DEBUG", {
      formatter: log.formatters.jsonFormatter,
      useColors: false,
    }),
  },
});

log.info("Process started", { pid: Deno.pid });

const host = Deno.env.get("OLLAMA_HOST") ?? "http://127.0.0.1:11434";

const ollama = new Ollama({ host });
const hono = new Hono();

hono.use(jsxRenderer());
hono.use("/static/*", serveStatic({ root: "./" }));
hono.get("/", (c) => c.render(<HomePage />));
hono.post("/chat", (c) =>
  streamText(c, async (stream) => {
    const { q } = c.req.query();
    const model = "llama3.1";
    const messages = [
      {
        role: "user",
        content: q,
      },
    ];

    const chatResponse = await ollama.chat({
      model,
      messages,
      stream: true,
    });

    for await (const chunk of chatResponse) {
      await stream.write(chunk.message.content);
    }
  })
);

const ac = new AbortController();
const db = new Database("test.db");
const [version] = db.prepare("select sqlite_version()").value<[string]>()!;
log.info("SQLite version", { version });

function shutdown() {
  log.info("Server shutdown initiated...");
  ac.abort();
  db.close();
  Deno.exit();
}

Deno.addSignalListener("SIGTERM", shutdown);
Deno.addSignalListener("SIGINT", shutdown);

Deno.serve(
  {
    onListen({ hostname, port }) {
      log.info("HTTP server started", {
        hostname,
        port,
      });
    },
    signal: ac.signal,
  },
  hono.fetch
);
