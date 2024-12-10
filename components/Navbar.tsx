import { Logo } from "./Logo.tsx";

export function Navbar() {
  return (
    <header class="bg-slate-700 border-slate-900 border-b text-slate-300">
      <div class="px-4 flex items-center justify-between">
        <div class="p-1 flex items-center">
          <Logo />
          <h1 class="text-3xl font-semibold p-2 whitespace-nowrap">
            Ollama Chat
          </h1>
        </div>
      </div>
    </header>
  );
}
