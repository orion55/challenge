import { Coordinates } from "./types";

export const range = (limit: number): number[] =>
  Array.from(Array(limit).keys());

export const sum = (numbers: number[]): number =>
  numbers.reduce((acc, val) => acc + val, 0);

export const multiply = (numbers: number[]): number =>
  numbers.reduce((acc, val) => acc * val, 1);

export const find = (
  coordinates: Coordinates[],
  coordinate: Coordinates
): Coordinates =>
  coordinates.find(([x, y]) => x === coordinate[0] && y === coordinate[1]);
