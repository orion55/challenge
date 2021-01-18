import {
  setCellFunction,
  buildSumFunctionDescription,
  getRows,
  getCellValue,
  isFunctionalCell,
  getFunctionalCellValue,
  buildMultiplyFunctionDescription,
  buildDivideFunctionDescription,
  setCell,
} from "..";
import { generateNumericTable } from "./utils";

describe("set function value", () => {
  test("with sum formula for 4 cells", () => {
    const table = generateNumericTable(2, 5);
    const updatedTable = setCellFunction(
      buildSumFunctionDescription([1, 0], [1, 1], [1, 2], [1, 3]),
      [1, 4],
      table
    );
    const rows = getRows(updatedTable);
    const cells = rows[1].columns;

    expect(getCellValue(cells[0])).toBe(21);
    expect(getCellValue(cells[1])).toBe(22);
    const resultCell = cells[4];
    if (isFunctionalCell(resultCell)) {
      expect(getFunctionalCellValue(resultCell)).toEqual({
        type: "function",
        computed: 21 + 22 + 23 + 24,
      });
    } else {
      throw new Error("Cell should be functional");
    }
  });
  test("with the same value for sum formula in 1 cell", () => {
    const table = generateNumericTable(2, 5);
    const updatedTable = setCellFunction(
      buildSumFunctionDescription([1, 0]),
      [1, 1],
      table
    );
    const rows = getRows(updatedTable);
    const cells = rows[1].columns;

    expect(getCellValue(cells[0])).toBe(21);
    const resultCell = cells[1];
    if (isFunctionalCell(resultCell)) {
      expect(getFunctionalCellValue(resultCell)).toEqual({
        type: "function",
        computed: 21,
      });
    } else {
      throw new Error("Cell should be functional");
    }
  });
  test("with multiplication formula for 4 cells", () => {
    const table = generateNumericTable(2, 5);
    const updatedTable = setCellFunction(
      buildMultiplyFunctionDescription([1, 0], [1, 1], [1, 2], [1, 3]),
      [1, 4],
      table
    );
    const rows = getRows(updatedTable);
    const cells = rows[1].columns;

    expect(getCellValue(cells[0])).toBe(21);
    expect(getCellValue(cells[1])).toBe(22);
    const resultCell = cells[4];
    if (isFunctionalCell(resultCell)) {
      expect(getFunctionalCellValue(resultCell)).toEqual({
        type: "function",
        computed: 21 * 22 * 23 * 24,
      });
    } else {
      throw new Error("Cell should be functional");
    }
  });
  test("with the same value for multiplication formula in 1 cell", () => {
    const table = generateNumericTable(2, 5);
    const updatedTable = setCellFunction(
      buildMultiplyFunctionDescription([1, 0]),
      [1, 1],
      table
    );
    const rows = getRows(updatedTable);
    const cells = rows[1].columns;

    expect(getCellValue(cells[0])).toBe(21);
    const resultCell = cells[1];
    if (isFunctionalCell(resultCell)) {
      expect(getFunctionalCellValue(resultCell)).toEqual({
        type: "function",
        computed: 21,
      });
    } else {
      throw new Error("Cell should be functional");
    }
  });
  test("with division formula for 2 cells", () => {
    const table = generateNumericTable(2, 3);
    const updatedTable = setCellFunction(
      buildDivideFunctionDescription([1, 0], [1, 1]),
      [1, 2],
      table
    );
    const rows = getRows(updatedTable);
    const cells = rows[1].columns;

    expect(getCellValue(cells[0])).toBe(21);
    expect(getCellValue(cells[1])).toBe(22);
    const resultCell = cells[2];
    if (isFunctionalCell(resultCell)) {
      expect(getFunctionalCellValue(resultCell)).toEqual({
        type: "function",
        computed: 21 / 22,
      });
    } else {
      throw new Error("Cell should be functional");
    }
  });
  test("with correct result if operand is also formula", () => {
    const table = generateNumericTable(2, 5);
    const tableWithFormula = setCellFunction(
      buildSumFunctionDescription([1, 0], [1, 1]),
      [1, 2],
      table
    );
    const tableWithTwoFormulas = setCellFunction(
      buildSumFunctionDescription([1, 2], [1, 3]),
      [1, 4],
      tableWithFormula
    );
    const rows = getRows(tableWithTwoFormulas);
    const cells = rows[1].columns;

    expect(getCellValue(cells[0])).toBe(21);
    expect(getCellValue(cells[1])).toBe(22);
    const firstResultCell = cells[2];
    if (isFunctionalCell(firstResultCell)) {
      expect(getFunctionalCellValue(firstResultCell)).toEqual({
        type: "function",
        computed: 21 + 22,
      });
    } else {
      throw new Error("Cell should be functional");
    }
    const secondResultCell = cells[4];
    if (isFunctionalCell(secondResultCell)) {
      expect(getFunctionalCellValue(secondResultCell)).toEqual({
        type: "function",
        computed: 21 + 22 + 24,
      });
    } else {
      throw new Error("Cell should be functional");
    }
  });
  test("with error if division formula provided with 0 divisor", () => {
    const table = generateNumericTable(2, 3);
    const tableWithZero = setCell(0, [1, 1], table);
    const updatedTable = setCellFunction(
      buildDivideFunctionDescription([1, 0], [1, 1]),
      [1, 2],
      tableWithZero
    );
    const rows = getRows(updatedTable);
    const cells = rows[1].columns;

    expect(getCellValue(cells[0])).toBe(21);
    expect(getCellValue(cells[1])).toBe(0);
    const resultCell = cells[2];
    if (isFunctionalCell(resultCell)) {
      expect(getFunctionalCellValue(resultCell)).toEqual({
        type: "FUNCTION_ERROR",
        computed: null,
      });
    } else {
      throw new Error("Cell should be functional");
    }
  });
  test("with error if any cell is not existed", () => {
    const table = generateNumericTable(2, 3);
    const tableWithEmptyCells = setCell(0, [7, 7], table);
    const updatedTable = setCellFunction(
      buildDivideFunctionDescription([1, 0], [5, 5]),
      [1, 2],
      tableWithEmptyCells
    );
    const rows = getRows(updatedTable);
    const cells = rows[1].columns;

    expect(getCellValue(cells[0])).toBe(21);
    expect(getCellValue(cells[1])).toBe(22);
    const resultCell = cells[2];
    if (isFunctionalCell(resultCell)) {
      expect(getFunctionalCellValue(resultCell)).toEqual({
        type: "FUNCTION_ERROR",
        computed: null,
      });
    } else {
      throw new Error("Cell should be functional");
    }
  });
  test("with updated value if operand was changed", () => {
    const table = generateNumericTable(2, 5);
    const tableWithFormula = setCellFunction(
      buildSumFunctionDescription([1, 0], [1, 1]),
      [1, 2],
      table
    );
    const tableWithUpdatedOperand = setCell(99, [1, 1], tableWithFormula);
    const rows = getRows(tableWithUpdatedOperand);
    const cells = rows[1].columns;

    expect(getCellValue(cells[0])).toBe(21);
    expect(getCellValue(cells[1])).toBe(99);
    const resultCell = cells[2];
    if (isFunctionalCell(resultCell)) {
      expect(getFunctionalCellValue(resultCell)).toEqual({
        type: "function",
        computed: 21 + 99,
      });
    } else {
      throw new Error("Cell should be functional");
    }
  });
  test("with recursively updated value if operand is function and was changed", () => {
    const table = generateNumericTable(2, 5);
    const tableWithFormula = setCellFunction(
      buildSumFunctionDescription([1, 0], [1, 1]),
      [1, 2],
      table
    );
    const tableWithTwoFormulas = setCellFunction(
      buildSumFunctionDescription([1, 2], [1, 3]),
      [1, 4],
      tableWithFormula
    );
    const tableWithUpdatedOperand = setCell(99, [1, 1], tableWithTwoFormulas);
    const rows = getRows(tableWithUpdatedOperand);
    const cells = rows[1].columns;

    expect(getCellValue(cells[0])).toBe(21);
    expect(getCellValue(cells[1])).toBe(99);
    const firstResultCell = cells[2];
    if (isFunctionalCell(firstResultCell)) {
      expect(getFunctionalCellValue(firstResultCell)).toEqual({
        type: "function",
        computed: 21 + 99,
      });
    } else {
      throw new Error("Cell should be functional");
    }
    const secondResultCell = cells[4];
    if (isFunctionalCell(secondResultCell)) {
      expect(getFunctionalCellValue(secondResultCell)).toEqual({
        type: "function",
        computed: 21 + 99 + 24,
      });
    } else {
      throw new Error("Cell should be functional");
    }
  });
  test("with unsubscription after another operands were used", () => {
    const table = generateNumericTable(2, 5);
    const tableWithOldCellsInFormula = setCellFunction(
      buildSumFunctionDescription([1, 1], [1, 2]),
      [1, 0],
      table
    );
    const tableWithUpdatedCellsInFormula = setCellFunction(
      buildSumFunctionDescription([1, 2], [1, 3]),
      [1, 0],
      tableWithOldCellsInFormula
    );
    const tableWithUpdatedOperand = setCell(
      99,
      [1, 1],
      tableWithUpdatedCellsInFormula
    );
    const rows = getRows(tableWithUpdatedOperand);
    const cells = rows[1].columns;

    expect(getCellValue(cells[1])).toBe(99);
    expect(getCellValue(cells[2])).toBe(23);
    const resultCell = cells[0];
    if (isFunctionalCell(resultCell)) {
      expect(getFunctionalCellValue(resultCell)).toEqual({
        type: "function",
        computed: 23 + 24,
      });
    } else {
      throw new Error("Cell should be functional");
    }
  });
});
