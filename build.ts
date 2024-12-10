import * as esbuild from "npm:esbuild";
import { denoPlugins } from "jsr:@luca/esbuild-deno-loader";

await esbuild.build({
  plugins: [...denoPlugins()],
  entryPoints: ["client/script.tsx"],
  bundle: true,
  outfile: "static/script.js",
  format: "esm",
  tsconfigRaw: `{
      "compilerOptions": {
        "jsx": "react-jsx",
        "jsxImportSource": "npm:hono/jsx/dom"
      }
    }`,
});
