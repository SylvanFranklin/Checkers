import { createSignal, For, Show } from "solid-js";
import { createStore } from "solid-js/store";
import {
  calculateLegalMoves,
  clearTrace,
  defaultBoard,
  SwapPositions,
} from "~/helper/funcs";
import { BiSolidCrown } from "solid-icons/bi";
import { Board, Checker, Pos, Square } from "~/helper/types";
import { Motion } from "@motionone/solid";

function CheckerPiece(props: Checker) {
  return (
    <Motion.span
      // initial={{scale: 0}}
      // animate={{scale: 1}}
      // transition={{duration: 3}}
      class={`p-2 m-1 rounded-full hover:scale-105 hover: brightness-105 duration-150 cursor-move
      ${props.isRed ? "bg-red-300" : "bg-gray-600 brightness-125"}`}
    >
      <div
        class={`z-20 w-14 h-14 rounded-full shadow-xl inset-0 brightness-110 flex items-center justify-center text-white text-4xl ${
          props.isRed ? "bg-red-300" : "bg-gray-600"
        }`}
      >
        <Show when={props.isKing}>
          <BiSolidCrown />
        </Show>
      </div>
    </Motion.span>
  );
}

function BoardSquare(props: { square: Square; isBlack: boolean; id: number }) {
  return (
    <span
      class={`w-20 h-20 ${
        props.isBlack ? "bg-slate-200" : "bg-gray-100"
      } flex items-center justify-center`}
    >
      <Show when={props.square.state.type == 1}>
        <CheckerPiece {...(props.square.state as Checker)} id={props.id} />
      </Show>
      <Show when={props.square.trace}>
        <div class="rounded-full w-10 h-10 bg-gray-400 opacity-30 z-40 inset-0"></div>
      </Show>
    </span>
  );
}

export function GameBoard(props: { redActive: boolean; toggle: Function }) {
  const [clickedIndex, setClickedIndex] = createSignal<Pos | undefined>();
  const [board, setBoard] = createStore<Board>(defaultBoard());

  return (
    <ol class="grid grid-cols-8 m-auto shadow-lg rounded-lg border-8 border-slate-200">
      <For each={board}>
        {(row, x) => (
          <span class="">
            <For each={row}>
              {(square, y) => {
                return (
                  <div
                    onClick={() => {
                      const pos: Pos = { x: x(), y: y() };
                      const squareData = board[pos.x][pos.y];

                      if (squareData.state.type == 1) {
                        if (
                          ((square.state as Checker).isRed &&
                            props.redActive) ||
                          (!(square.state as Checker).isRed && !props.redActive)
                        ) {
                          setBoard(clearTrace(board));
                          const [tracedBoard, legalMoveCount] =
                            calculateLegalMoves(board, pos);
                          if (legalMoveCount > 0) {
                            setClickedIndex(pos);
                            setBoard(tracedBoard);
                          }
                        }
                      } else if (squareData.trace && clickedIndex()) {
                        const [newBoard, sucess, jumped] = SwapPositions(
                          board,
                          pos,
                          clickedIndex() as Pos
                        );
                        if (sucess) {
                          setBoard(newBoard);
                          if (!jumped) {
                            props.toggle()
                          }
                        }
                      }
                    }}
                  >
                    <h1 class="opacity-60 rounded-md text-center absolute text-gray-400 font-bold text-2xl select-none ">
                      {x()}, {y()}
                    </h1>

                    <BoardSquare
                      square={square}
                      id={Number(`${x()}${y()}`)}
                      isBlack={y() % 2 == 0 ? x() % 2 == 0 : x() % 2 == 1}
                    />
                  </div>
                );
              }}
            </For>
          </span>
        )}
      </For>
    </ol>
  );
}
