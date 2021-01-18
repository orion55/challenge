import { getRows, getCellValue, getCellCoordinates, addRow } from "..";
import { generateTable } from "./utils";

describe("add row", () => {
  test("to empty table", () => {
    const table = generateTable(1, 2); // generate table with 1 row and 2 columns and string values like "1; 1"
    const createdRows = getRows(table);
    expect(createdRows.length).toBe(1);
    const [firstCell, secondCell] = createdRows[0].columns;

    expect(getCellValue(firstCell)).toBe("1; 1");
    expect(getCellCoordinates(firstCell)).toEqual([0, 0]);
    expect(getCellValue(secondCell)).toBe("1; 2");
    expect(getCellCoordinates(secondCell)).toEqual([0, 1]);
  });
  test("to filled table", () => {
    const tableWithOneRow = generateTable(1, 2);
    const tableWithTwoRow = addRow(["2; 1", "2; 2"], tableWithOneRow);
    const createdRows = getRows(tableWithTwoRow);
    expect(createdRows.length).toBe(2);
    const [firstCell, secondCell] = createdRows[1].columns;

    expect(getCellValue(firstCell)).toBe("2; 1");
    expect(getCellCoordinates(firstCell)).toEqual([1, 0]);
    expect(getCellValue(secondCell)).toBe("2; 2");
    expect(getCellCoordinates(secondCell)).toEqual([1, 1]);
  });
});
