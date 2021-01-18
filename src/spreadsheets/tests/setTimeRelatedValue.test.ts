import { setCell, getRows, getCellValue, getCellCoordinates } from "..";
import { generateTable } from "./utils";

describe("set time-related value", () => {
  const plainDate = new Date(2020, 10, 25, 13, 48, 59);
  test("date and time to existed cell", () => {
    const table = generateTable(3, 3);
    const updatedTable = setCell(plainDate, [1, 1], table, "DATETIME");

    const rows = getRows(updatedTable);
    expect(rows.length).toBe(3);
    const [firstCell, secondCell, thirdCell] = rows[1].columns;

    expect(getCellValue(firstCell)).toBe("2; 1");
    expect(getCellCoordinates(firstCell)).toEqual([1, 0]);
    expect(getCellValue(secondCell)).toEqual(plainDate);
    expect(getCellCoordinates(secondCell)).toEqual([1, 1]);
    expect(getCellValue(thirdCell)).toBe("2; 3");
    expect(getCellCoordinates(thirdCell)).toEqual([1, 2]);
  });
  test("just date to existed cell", () => {
    const table = generateTable(3, 3);
    const testDate = new Date(plainDate.getTime());
    const updatedTable = setCell(testDate, [1, 1], table, "DATE");

    const rows = getRows(updatedTable);
    const [firstCell, secondCell, thirdCell] = rows[1].columns;
    const expectedDate = new Date(2020, 10, 25);

    expect(getCellValue(firstCell)).toBe("2; 1");
    expect(getCellCoordinates(firstCell)).toEqual([1, 0]);
    expect(getCellValue(secondCell)).toEqual(expectedDate);
    expect(getCellCoordinates(secondCell)).toEqual([1, 1]);
    expect(getCellValue(thirdCell)).toBe("2; 3");
    expect(getCellCoordinates(thirdCell)).toEqual([1, 2]);
  });
  test("just time to existed cell", () => {
    const table = generateTable(3, 3);
    const testDate = new Date(plainDate.getTime());
    const updatedTable = setCell(testDate, [1, 1], table, "TIME");

    const rows = getRows(updatedTable);
    const [firstCell, secondCell, thirdCell] = rows[1].columns;
    const expectedDate = new Date(0, 0, 0, 13, 48, 59);

    expect(getCellValue(firstCell)).toBe("2; 1");
    expect(getCellCoordinates(firstCell)).toEqual([1, 0]);
    expect(getCellValue(secondCell)).toEqual(expectedDate);
    expect(getCellCoordinates(secondCell)).toEqual([1, 1]);
    expect(getCellValue(thirdCell)).toBe("2; 3");
    expect(getCellCoordinates(thirdCell)).toEqual([1, 2]);
  });
  test("to empty cell in the new row and new column", () => {
    const table = generateTable(2, 2);
    const updatedTable = setCell(plainDate, [5, 5], table, "DATETIME");

    const rows = getRows(updatedTable);
    expect(rows.length).toBe(6);
    const cells = rows[5].columns;

    expect(getCellValue(cells[0])).toBe(null);
    expect(getCellCoordinates(cells[0])).toEqual([5, 0]);
    expect(getCellValue(cells[4])).toBe(null);
    expect(getCellCoordinates(cells[4])).toEqual([5, 4]);
    expect(getCellValue(cells[5])).toEqual(plainDate);
    expect(getCellCoordinates(cells[5])).toEqual([5, 5]);
  });
  test("date and time without time format to cause error", () => {
    const table = generateTable(3, 3);
    expect(() => setCell(plainDate, [1, 1], table)).toThrow(
      "Time related values are not allowed without explicit date format"
    );
  });
});
