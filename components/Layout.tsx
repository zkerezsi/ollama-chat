import { PropsWithChildren } from "jsr:@hono/hono/jsx";

export function Layout(props: PropsWithChildren) {
  return (
    <html>
      <head>
        <title>Ollama Chat</title>
        <link
          rel="shortcut icon"
          href="/static/logo.svg"
          type="image/svg"
        ></link>
        <script type="module" src="/static/script.js"></script>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1"
        ></meta>
        <link rel="stylesheet" href="/static/style.css" />
        <link rel="stylesheet" href="/static/github-dark.css"></link>
      </head>
      <body class="h-full flex flex-col bg-slate-400">{props.children}</body>
    </html>
  );
}
