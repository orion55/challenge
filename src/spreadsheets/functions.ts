import {
  SumFunctionDescription,
  MultiplyFunctionDescription,
  SubtractFunctionDescription,
  DivideFunctionDescription,
  Table,
  FunctionDescription,
  Cell,
  Coordinates,
  FunctionalCellValue,
  FunctionalCellFields,
} from "./types";
import {
  getCellValueByCoordinates,
  isFunctionalCellValue,
  setCellValue,
  isFunctionalCell,
  getCellByCoordinates,
} from "./main";
import { sum, multiply, find } from "./other";

export function buildSumFunctionDescription(
  ...cells: Coordinates[]
): SumFunctionDescription {
  return { operation: "SUM", cells };
}
export function buildMultiplyFunctionDescription(
  ...cells: Coordinates[]
): MultiplyFunctionDescription {
  return { operation: "MULTIPLY", cells };
}
export function buildSubtractFunctionDescription(
  subtrahend: Coordinates,
  minuend: Coordinates
): SubtractFunctionDescription {
  return { operation: "SUBTRACT", subtrahend, minuend };
}
export function buildDivideFunctionDescription(
  dividend: Coordinates,
  divisor: Coordinates
): DivideFunctionDescription {
  return {
    operation: "DIVIDE",
    dividend,
    divisor,
  };
}

function getOperandsOrError(
  coordinates: Array<Coordinates>,
  table: Table
): Array<number> | "FUNCTION_ERROR" {
  try {
    return coordinates.map((cellCoordinates) => {
      const value = getCellValueByCoordinates(cellCoordinates, table);
      if (typeof value === "number") {
        return value;
      }
      if (isFunctionalCellValue(value)) {
        return value.computed;
      }
      throw new Error("FUNCTION_ERROR");
    });
  } catch (e) {
    return "FUNCTION_ERROR";
  }
}
function computeSum(
  functionDescription: SumFunctionDescription,
  table: Table
): number | "FUNCTION_ERROR" {
  const operands = getOperandsOrError(functionDescription.cells, table);
  if (operands === "FUNCTION_ERROR") {
    return "FUNCTION_ERROR";
  }
  return sum(operands);
}
function computeMultiplication(
  functionDescription: MultiplyFunctionDescription,
  table: Table
): number | "FUNCTION_ERROR" {
  const operands = getOperandsOrError(functionDescription.cells, table);
  if (operands === "FUNCTION_ERROR") {
    return "FUNCTION_ERROR";
  }
  return multiply(operands);
}
function computeSubtraction(
  functionDescription: SubtractFunctionDescription,
  table: Table
): number | "FUNCTION_ERROR" {
  const operands = getOperandsOrError(
    [functionDescription.subtrahend, functionDescription.minuend],
    table
  );
  if (operands === "FUNCTION_ERROR") {
    return "FUNCTION_ERROR";
  }
  const [subtrahend, minuend] = operands;
  return subtrahend - minuend;
}
function computeDivision(
  functionDescription: DivideFunctionDescription,
  table: Table
): number | "FUNCTION_ERROR" {
  const operands = getOperandsOrError(
    [functionDescription.dividend, functionDescription.divisor],
    table
  );
  if (operands === "FUNCTION_ERROR") {
    return "FUNCTION_ERROR";
  }
  const [dividend, divisor] = operands;
  if (divisor === 0) {
    return "FUNCTION_ERROR";
  }
  return dividend / divisor;
}

function dispatchComputation(
  functionDescription: FunctionDescription,
  table: Table
): number | "FUNCTION_ERROR" {
  if (functionDescription.operation === "SUM") {
    return computeSum(functionDescription, table);
  }
  if (functionDescription.operation === "MULTIPLY") {
    return computeMultiplication(functionDescription, table);
  }
  if (functionDescription.operation === "SUBTRACT") {
    return computeSubtraction(functionDescription, table);
  }
  if (functionDescription.operation === "DIVIDE") {
    return computeDivision(functionDescription, table);
  }
  return "FUNCTION_ERROR";
}

function markCellAsUsedInFormula(
  [rowId, columnId]: Coordinates,
  formulaCoordinates: Coordinates,
  table: Table
): Table {
  const isAlreadyMarked = (cell: Cell) =>
    find(cell.usedInFormulas, formulaCoordinates);
  return {
    rows: table.rows.map((row, rowIndex) => {
      const cell = row.columns[columnId];
      return rowIndex === rowId && !isAlreadyMarked(cell)
        ? {
            ...row,
            columns: [
              ...row.columns.slice(0, columnId),
              {
                ...cell,
                usedInFormulas: cell.usedInFormulas.concat([
                  formulaCoordinates,
                ]),
              },
              ...row.columns.slice(columnId + 1),
            ],
          }
        : row;
    }),
  };
}
function markOperandsAsUsedInFormula(
  operandCoordinates: Array<Coordinates>,
  formulaCoordinates: Coordinates,
  table: Table
): Table {
  return operandCoordinates.reduce((updatedTable, cellCoordinates) => {
    return markCellAsUsedInFormula(
      cellCoordinates,
      formulaCoordinates,
      updatedTable
    );
  }, table);
}

function cleanPreviousCellAsUsedInFormula(
  [rowId, columnId]: Coordinates,
  formulaCoordinates: Coordinates,
  table: Table
): Table {
  const getPreviousFormulaIndex = (cell: Cell) =>
    cell.usedInFormulas.findIndex(
      ([x, y]) => x === formulaCoordinates[0] && y === formulaCoordinates[1]
    );
  return {
    rows: table.rows.map((row, rowIndex) => {
      const cell = row.columns[columnId];
      const previousFormulaIndex = getPreviousFormulaIndex(cell);
      const isPreviouslyMarked = previousFormulaIndex !== -1;
      if (isPreviouslyMarked) {
        cell.usedInFormulas.splice(previousFormulaIndex, 1);
      }
      return row;
    }),
  };
}
function cleanPreviousOperandsAsUsedInFormula(
  previousOperands: Array<Coordinates>,
  formulaCoordinates: Coordinates,
  table: Table
): Table {
  return previousOperands.reduce((updatedTable, cellCoordinates) => {
    return cleanPreviousCellAsUsedInFormula(
      cellCoordinates,
      formulaCoordinates,
      updatedTable
    );
  }, table);
}

function getFormulaOperands(
  functionDescription: FunctionDescription
): Array<Coordinates> {
  if (functionDescription.operation === "SUM") {
    return functionDescription.cells;
  }
  if (functionDescription.operation === "MULTIPLY") {
    return functionDescription.cells;
  }
  if (functionDescription.operation === "SUBTRACT") {
    return [functionDescription.subtrahend, functionDescription.minuend];
  }
  if (functionDescription.operation === "DIVIDE") {
    return [functionDescription.dividend, functionDescription.divisor];
  }
}

export function setCellFunction(
  functionDescription: FunctionDescription,
  coordinates: Coordinates,
  table: Table
): Table {
  const computedValue:
    | FunctionalCellValue["computed"]
    | "FUNCTION_ERROR" = dispatchComputation(functionDescription, table);
  const newCell: FunctionalCellFields = {
    value:
      computedValue === "FUNCTION_ERROR"
        ? { type: "FUNCTION_ERROR", computed: null }
        : {
            type: "function",
            computed: computedValue,
          },
    function: functionDescription,
  };
  const operands = getFormulaOperands(functionDescription);
  const tableWithMarkedCells = markOperandsAsUsedInFormula(
    operands,
    coordinates,
    table
  );
  const previousCellState = getCellByCoordinates(coordinates, table);
  const tableWithCleanedCells = isFunctionalCell(previousCellState)
    ? cleanPreviousOperandsAsUsedInFormula(
        getFormulaOperands(previousCellState.function),
        coordinates,
        tableWithMarkedCells
      )
    : tableWithMarkedCells;
  return setCellValue(newCell, coordinates, tableWithCleanedCells);
}
