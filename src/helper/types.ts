export interface Checker {
  type: State.Checker;
  isRed: boolean;
  isKing: boolean;
  id: number
}

export enum State {
  Empty = 0,
  Checker = 1,
}

export interface Empty {
  type: State.Empty;
}

export interface Square {
  state: Checker | Empty;
  trace: boolean;
}

export interface Pos {
  x: number;
  y: number;
}

interface DirectionMap {
  [key: string]: Pos;

}

export const NEWS: DirectionMap = {
  N: { x: 0, y: -2 },
  S: { x: 0, y: 2 },
  E: { x: 2, y: 0 },
  W: { x: -2, y: 0 },
  NE: { x: 1, y: -1 },
  NW: { x: -1, y: -1 },
  SE: { x: 1, y: 1 },
  SW: { x: -1, y: 1 },
};



export type Board = Square[][];

