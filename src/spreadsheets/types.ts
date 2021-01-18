export type Table = {
  rows: Array<Row>;
};

export type Row = {
  rowId: number;
  columns: Array<Cell>;
};

export type Coordinates = [number, number];

export type Cell = OrdinaryCell | FunctionalCell;

export type OrdinaryCell = {
  value: number | string | null | Date;
  rowId: number;
  columnId: number;
  dateFormat?: "DATETIME" | "DATE" | "TIME";
  usedInFormulas: Array<Coordinates>;
};

export type FunctionalCellValue = {
  type: "function" | "FUNCTION_ERROR";
  computed: number | null;
};
export type FunctionalCellFields = {
  value: FunctionalCellValue;
  function: FunctionDescription;
};
export type FunctionalCell = Omit<OrdinaryCell, "value"> & FunctionalCellFields;

export type FunctionDescription =
  | SumFunctionDescription
  | MultiplyFunctionDescription
  | SubtractFunctionDescription
  | DivideFunctionDescription;

export type SumFunctionDescription = {
  operation: "SUM";
  cells: Array<Coordinates>;
};
export type MultiplyFunctionDescription = {
  operation: "MULTIPLY";
  cells: Array<Coordinates>;
};
export type SubtractFunctionDescription = {
  operation: "SUBTRACT";
  subtrahend: Coordinates;
  minuend: Coordinates;
};
export type DivideFunctionDescription = {
  operation: "DIVIDE";
  dividend: Coordinates;
  divisor: Coordinates;
};
