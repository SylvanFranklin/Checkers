import { Board, Checker, NEWS, Pos, Square, State } from "./types";

function countLegalMoves(board: Board): number {
  let count = 0;
  for (const row of board) {
    for (const square of row) {
      if (square.trace) {
        count++;
      }
    }
  }
  return count;
}

function deepClone(board: Board): Board {
  const newBoard = [];
  for (const row of board) {
    const newRow = [];
    for (const square of row) {
      newRow.push(square);
    }
    newBoard.push(newRow);
  }

  return newBoard;
}

export function SwapPositions(
  board: Board,
  target: Pos,
  checker: Pos
): [Board, boolean] {
  if (!board[target.x][target.y].trace) {
    return [board, false];
  }
  const copy = deepClone(board);
  const temp = copy[target.x][target.y];
  copy[target.x][target.y] = copy[checker.x][checker.y];
  copy[checker.x][checker.y] = temp;

  const dir = {
    x: Math.floor(target.x - checker.x),
    y: Math.floor(target.y - checker.y),
  } as Pos;

  const jumpedPos: Pos = { x: -1, y: -1 };

  // check if a jump has occured
  if (dir.x % 2 == 0) {
    jumpedPos.x = target.x - dir.x / 2;
  }
  if (dir.y % 2 == 0) {
    jumpedPos.y = target.y - dir.y / 2;
  }

  if (jumpedPos.x >= 0 && jumpedPos.y >= 0) {
    copy[jumpedPos.x][jumpedPos.y] = { trace: false, state: { type: 0 } };
  }

  // check if ricochet has occured
  // this handels vertical
  if (Math.abs(dir.y) == 2 && dir.x == 0) {
    copy[checker.x < 2 ? jumpedPos.x - 1 : jumpedPos.x + 1][jumpedPos.y] = {
      trace: false,
      state: { type: 0 },
    };
  }
  // this handels horizontal
  if (Math.abs(dir.x) == 2 && dir.y == 0) {
    copy[jumpedPos.x][checker.y < 2 ? jumpedPos.y - 1 : jumpedPos.y + 1] = {
      trace: false,
      state: { type: 0 },
    };
  }

  // this handels pieces moving to the end
  if (target.y == 0 && (copy[target.x][target.y].state as Checker).isRed) {
    copy[target.x][target.y] = {
      ...copy[target.x][target.y],
      state: { ...copy[target.x][target.y].state, isKing: true } as Checker,
    };
  } else if (
    target.y == 7 &&
    !(copy[target.x][target.y].state as Checker).isRed
  ) {
    copy[target.x][target.y] = {
      ...copy[target.x][target.y],
      state: { ...copy[target.x][target.y].state, isKing: true } as Checker,
    };
  }

  return [clearTrace(copy), true];
}

export function devBoard(): Board {
  const board: Board = [];

  const states = [
    [
      { type: 0 },
      { type: 0 },
      { type: 0 },
      { type: 0 },
      { type: 0 },
      { type: 0 },
      { type: 0 },
      { type: 0 },
    ],
    [
      { type: 0 },
      { type: 0 },
      { type: 1, isRed: false, isKing: true },
      { type: 0 },
      { type: 1, isRed: true, isKing: false },
      { type: 0 },
      { type: 0 },
      { type: 0 },
    ],
    [
      { type: 0 },
      { type: 0 },
      { type: 0 },
      { type: 0 },
      { type: 0 },
      { type: 0 },
      { type: 0 },
      { type: 0 },
    ],
    [
      { type: 0 },
      { type: 0 },
      { type: 0 },
      { type: 0 },
      { type: 0 },
      { type: 0 },
      { type: 0 },
      { type: 0 },
    ],
    [
      { type: 0 },
      { type: 0 },
      { type: 0 },
      { type: 0 },
      { type: 0 },
      { type: 0 },
      { type: 0 },
      { type: 0 },
    ],
    [
      { type: 0 },
      { type: 0 },
      { type: 0 },
      { type: 0 },
      { type: 0 },
      { type: 0 },
      { type: 0 },
      { type: 0 },
    ],
    [
      { type: 0 },
      { type: 0 },
      { type: 0 },
      { type: 0 },
      { type: 0 },
      { type: 0 },
      { type: 0 },
      { type: 0 },
    ],
    [
      { type: 0 },
      { type: 0 },
      { type: 0 },
      { type: 0 },
      { type: 0 },
      { type: 0 },
      { type: 0 },
      { type: 0 },
    ],
  ];

  for (const row of states) {
    const newRow: Square[] = [];
    for (const stateOBJ of row) {
      newRow.push({ trace: false, state: stateOBJ });
    }
    board.push(newRow);
  }
  return board;
}

export function defaultBoard(): Board {
  const board: Board = [];
  const states = [
    [
      { type: 1, isKing: false, isRed: false },
      { type: 0 },
      { type: 1, isKing: false, isRed: false },
      { type: 0 },
      { type: 0 },
      { type: 0 },
      { type: 1, isKing: false, isRed: true },
      { type: 0 },
    ],
    [
      { type: 0 },
      { type: 1, isKing: false, isRed: false },
      { type: 0 },
      { type: 0 },
      { type: 0 },
      { type: 1, isKing: false, isRed: true },
      { type: 0 },
      { type: 1, isKing: false, isRed: true },
    ],
    [
      { type: 1, isKing: false, isRed: false },
      { type: 0 },
      { type: 1, isKing: false, isRed: false },
      { type: 0 },
      { type: 0 },
      { type: 0 },
      { type: 1, isKing: false, isRed: true },
      { type: 0 },
    ],
    [
      { type: 0 },
      { type: 1, isKing: false, isRed: false },
      { type: 0 },
      { type: 0 },
      { type: 0 },
      { type: 1, isKing: false, isRed: true },
      { type: 0 },
      { type: 1, isKing: false, isRed: true },
    ],
    [
      { type: 1, isKing: false, isRed: false },
      { type: 0 },
      { type: 1, isKing: false, isRed: false },
      { type: 0 },
      { type: 0 },
      { type: 0 },
      { type: 1, isKing: false, isRed: true },
      { type: 0 },
    ],
    [
      { type: 0 },
      { type: 1, isKing: false, isRed: false },
      { type: 0 },
      { type: 0 },
      { type: 0 },
      { type: 1, isKing: false, isRed: true },
      { type: 0 },
      { type: 1, isKing: false, isRed: true },
    ],
    [
      { type: 1, isKing: false, isRed: false },
      { type: 0 },
      { type: 1, isKing: false, isRed: false },
      { type: 0 },
      { type: 0 },
      { type: 0 },
      { type: 1, isKing: false, isRed: true },
      { type: 0 },
    ],
    [
      { type: 0 },
      { type: 1, isKing: false, isRed: false },
      { type: 0 },
      { type: 0 },
      { type: 0 },
      { type: 1, isKing: false, isRed: true },
      { type: 0 },
      { type: 1, isKing: false, isRed: true },
    ],
  ];

  for (const row of states) {
    const newRow: Square[] = [];
    for (const stateOBJ of row) {
      newRow.push({ trace: false, state: stateOBJ });
    }

    board.push(newRow);
  }
  return board;
}

// returns the type [Board, number of legal moves]
export function calculateLegalMoves(
  board: Board,
  checkerPos: Pos
): [Board, number] {
  function addTrace(pos: Pos, dir: Pos) {
    const target = { x: pos.x + dir.x, y: pos.y + dir.y };

    if (inBounds(target)) {
      if (copy[target.x][target.y].state.type == 1) {
        if (
          inBounds({ x: target.x + dir.x, y: target.y + dir.y }) &&
          copy[target.x + dir.x][target.y + dir.y].state.type == 0
        ) {
          copy[target.x + dir.x][target.y + dir.y] = {
            ...copy[target.x + dir.x][target.y + dir.y],
            trace: true,
          };
        }
      } else {
        copy[target.x][target.y] = { ...copy[target.x][target.y], trace: true };
      }
    }
    // ricochet

    if (inBounds(target) && copy[target.x][target.y].state.type == 1) {
      if (!inBounds({ x: target.x + dir.x, y: target.y + dir.y })) {
        const newPos = { ...pos, y: pos.y + 2 * dir.y };
        if (inBounds(newPos))
          copy[newPos.x][newPos.y] = {
            ...copy[newPos.x][newPos.y],
            trace: true,
          };

        if ((copy[pos.x][pos.y].state as Checker).isKing) {
          const newPos = { ...pos, x: pos.x + 2 * dir.x };
          if (inBounds(newPos))
            copy[newPos.x][newPos.y] = {
              ...copy[newPos.x][newPos.y],
              trace: true,
            };
        }
      }
    }
  }

  function addSpecialTrace(pos: Pos, dir: Pos) {
    const target: Pos = { x: pos.x + dir.x, y: pos.y + dir.y };

    // long trace, which has to be here because if it is in the normal
    // place it places a trace where the shouldn't be one.
    if (inBounds(target) && copy[target.x][target.y].state.type == 1) {
      const newTarget = { x: target.x + dir.x, y: target.y + dir.y };
      if (
        inBounds(newTarget) &&
        copy[newTarget.x][newTarget.y].state.type == 0
      ) {
        copy[newTarget.x][newTarget.y] = {
          ...copy[newTarget.x][newTarget.y],
          trace: true,
        };
      }
    }
  }

  function inBounds(target: Pos): boolean {
    return !(target.x < 0 || target.x > 7 || target.y > 7 || target.y < 0);
  }

  const copy = deepClone(board);

  if (copy[checkerPos.x][checkerPos.y].state.type == 0) {
    return [copy, 0];
  }

  const checker = copy[checkerPos.x][checkerPos.y].state as Checker;
  switch (true) {
    // black
    case !checker.isRed && !checker.isKing:
      addTrace(checkerPos, NEWS.SE);
      addTrace(checkerPos, NEWS.SW);
      addSpecialTrace(checkerPos, NEWS.S);
      break;
    // red
    case checker.isRed && !checker.isKing:
      addTrace(checkerPos, NEWS.NE);
      addTrace(checkerPos, NEWS.NW);
      addSpecialTrace(checkerPos, NEWS.N);
      break;
    // king
    default:
      addTrace(checkerPos, NEWS.SE);
      addTrace(checkerPos, NEWS.SW);
      addTrace(checkerPos, NEWS.NE);
      addTrace(checkerPos, NEWS.NW);
      addSpecialTrace(checkerPos, NEWS.S);
      addSpecialTrace(checkerPos, NEWS.N);
      addSpecialTrace(checkerPos, NEWS.E);
      addSpecialTrace(checkerPos, NEWS.W);
      break;
  }
  return [copy, countLegalMoves(copy)];
}

export function clearTrace(board: Board): Board {
  const newBoard = [];

  for (const row of board) {
    const newRow = [];
    for (const square of row) {
      newRow.push({ ...square, trace: false });
    }
    newBoard.push(newRow);
  }

  return newBoard;
}
