import { addColumn, getRows, getCellValue, getCellCoordinates } from "..";
import { generateTable } from "./utils";

describe("add column", () => {
  test("after existed", () => {
    const table = generateTable(3, 2);
    const updatedTable = addColumn(2, table);

    const rows = getRows(updatedTable);
    expect(rows.length).toBe(3);
    const cells = rows[1].columns;
    expect(cells.length).toBe(3);
    const [firstCell, secondCell, thirdCell] = cells;

    expect(getCellValue(firstCell)).toBe("2; 1");
    expect(getCellCoordinates(firstCell)).toEqual([1, 0]);
    expect(getCellValue(secondCell)).toBe("2; 2");
    expect(getCellCoordinates(secondCell)).toEqual([1, 1]);
    expect(getCellValue(thirdCell)).toBe(null);
    expect(getCellCoordinates(thirdCell)).toEqual([1, 2]);
  });
  test("between existed", () => {
    const table = generateTable(3, 2);
    const updatedTable = addColumn(1, table);

    const rows = getRows(updatedTable);
    expect(rows.length).toBe(3);
    const [firstCell, secondCell, thirdCell] = rows[1].columns;

    expect(getCellValue(firstCell)).toBe("2; 1");
    expect(getCellCoordinates(firstCell)).toEqual([1, 0]);
    expect(getCellValue(secondCell)).toBe(null);
    expect(getCellCoordinates(secondCell)).toEqual([1, 1]);
    expect(getCellValue(thirdCell)).toBe("2; 2");
    expect(getCellCoordinates(thirdCell)).toEqual([1, 2]);
  });
  test("out of range", () => {
    const table = generateTable(3, 2);
    const updatedTable = addColumn(4, table);

    const rows = getRows(updatedTable);
    expect(rows.length).toBe(3);
    const cells = rows[1].columns;

    expect(getCellValue(cells[0])).toBe("2; 1");
    expect(getCellCoordinates(cells[0])).toEqual([1, 0]);
    expect(getCellValue(cells[1])).toBe("2; 2");
    expect(getCellCoordinates(cells[1])).toEqual([1, 1]);
    expect(getCellValue(cells[2])).toBe(null);
    expect(getCellCoordinates(cells[2])).toEqual([1, 2]);
    expect(getCellValue(cells[3])).toBe(null);
    expect(getCellCoordinates(cells[3])).toEqual([1, 3]);
    expect(getCellValue(cells[4])).toBe(null);
    expect(getCellCoordinates(cells[4])).toEqual([1, 4]);
    expect(cells[5]).toBeUndefined();
  });
});
