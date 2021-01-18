import { deleteRow, getRows, getCellValue, getCellCoordinates } from "..";
import { generateTable } from "./utils";

describe("delete row", () => {
  test("only last one", () => {
    const table = generateTable(3, 3);
    const updatedTable = deleteRow(2, table);
    const updatedRows = getRows(updatedTable);
    expect(updatedRows.length).toBe(2);
    const [firstCell, secondCell, thirdCell] = updatedRows[1].columns;

    expect(getCellValue(firstCell)).toBe("2; 1");
    expect(getCellCoordinates(firstCell)).toEqual([1, 0]);
    expect(getCellValue(secondCell)).toBe("2; 2");
    expect(getCellCoordinates(secondCell)).toEqual([1, 1]);
    expect(getCellValue(thirdCell)).toBe("2; 3");
    expect(getCellCoordinates(thirdCell)).toEqual([1, 2]);
  });
  test("between existed", () => {
    const table = generateTable(3, 3);
    const updatedTable = deleteRow(1, table);
    const updatedRows = getRows(updatedTable);
    expect(updatedRows.length).toBe(2);
    const [firstCell, secondCell, thirdCell] = updatedRows[1].columns;

    expect(getCellValue(firstCell)).toBe("3; 1");
    expect(getCellCoordinates(firstCell)).toEqual([1, 0]);
    expect(getCellValue(secondCell)).toBe("3; 2");
    expect(getCellCoordinates(secondCell)).toEqual([1, 1]);
    expect(getCellValue(thirdCell)).toBe("3; 3");
    expect(getCellCoordinates(thirdCell)).toEqual([1, 2]);
  });
});
