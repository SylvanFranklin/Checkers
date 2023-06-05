import { createSignal } from "solid-js";
import { GameBoard } from "~/components/game";

export default function Home() {
  const [redActive, setRedActive] = createSignal(true);

  return (
    <main class="flex w-full h-full flex-col space-y-10">
      <h1
        class={`rounded-lg shadow-md border-8 border-slate-200 flex items-center justify-center font-mono font-bold w-1/2 mx-auto text-3xl mt-20 py-2 ${
          redActive() ? "text-red-300" : "text-gray-800"
        }`}
      >
        {redActive() ? "Red to play" : "black to play"}
      </h1>
      <GameBoard redActive={redActive()} toggle={() => setRedActive(!redActive())} />
    </main>
  );
}
