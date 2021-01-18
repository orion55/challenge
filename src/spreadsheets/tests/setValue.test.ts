import { setCell, getRows, getCellValue, getCellCoordinates } from "..";
import { generateTable } from "./utils";

describe("set value", () => {
  test("to existed cell", () => {
    const table = generateTable(3, 3);
    const updatedTable = setCell("new value", [1, 1], table);

    const rows = getRows(updatedTable);
    expect(rows.length).toBe(3);
    const [firstCell, secondCell, thirdCell] = rows[1].columns;

    expect(getCellValue(firstCell)).toBe("2; 1");
    expect(getCellCoordinates(firstCell)).toEqual([1, 0]);
    expect(getCellValue(secondCell)).toBe("new value");
    expect(getCellCoordinates(secondCell)).toEqual([1, 1]);
    expect(getCellValue(thirdCell)).toBe("2; 3");
    expect(getCellCoordinates(thirdCell)).toEqual([1, 2]);
  });
  test("to empty cell in the new row next to existed", () => {
    const table = generateTable(1, 3);
    const updatedTable = setCell("new value", [1, 1], table);

    const rows = getRows(updatedTable);
    expect(rows.length).toBe(2);
    const [firstCell, secondCell, thirdCell] = rows[1].columns;

    expect(getCellValue(firstCell)).toBe(null);
    expect(getCellCoordinates(firstCell)).toEqual([1, 0]);
    expect(getCellValue(secondCell)).toBe("new value");
    expect(getCellCoordinates(secondCell)).toEqual([1, 1]);
    expect(getCellValue(thirdCell)).toBe(null);
    expect(getCellCoordinates(thirdCell)).toEqual([1, 2]);
  });
  test("to empty cell in the existed row but new column", () => {
    const table = generateTable(2, 3);
    const updatedTable = setCell("new value", [1, 5], table);

    const rows = getRows(updatedTable);
    expect(rows.length).toBe(2);
    const cells = rows[1].columns;

    expect(getCellValue(cells[0])).toBe("2; 1");
    expect(getCellCoordinates(cells[0])).toEqual([1, 0]);
    expect(getCellValue(cells[4])).toBe(null);
    expect(getCellCoordinates(cells[4])).toEqual([1, 4]);
    expect(getCellValue(cells[5])).toBe("new value");
    expect(getCellCoordinates(cells[5])).toEqual([1, 5]);
  });
  test("to empty cell in the new row and new column", () => {
    const table = generateTable(2, 2);
    const updatedTable = setCell("new value", [5, 5], table);

    const rows = getRows(updatedTable);
    expect(rows.length).toBe(6);
    const cells = rows[5].columns;

    expect(getCellValue(rows[1].columns[1])).toBe("2; 2");
    expect(getCellCoordinates(rows[1].columns[1])).toEqual([1, 1]);
    expect(getCellValue(cells[0])).toBe(null);
    expect(getCellCoordinates(cells[0])).toEqual([5, 0]);
    expect(getCellValue(cells[4])).toBe(null);
    expect(getCellCoordinates(cells[4])).toEqual([5, 4]);
    expect(getCellValue(cells[5])).toBe("new value");
    expect(getCellCoordinates(cells[5])).toEqual([5, 5]);
  });
});
