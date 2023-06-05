import { GameBoard } from "~/components/game";

export default function Home() {
  return (
    
    <main class="flex w-full h-full flex-col space-y-10">
      <h1 class="text-center w-1/3 mt-10 font-mono text-4xl font-bold bg-blue-300 px-6 py-3 rounded-lg text-white mx-auto">
      Otis Checkers
      </h1>
      <GameBoard />
    </main>
  );
}
