import { deleteColumn, getRows, getCellValue, getCellCoordinates } from "..";
import { generateTable } from "./utils";

describe("delete column", () => {
  test("only last one", () => {
    const table = generateTable(3, 3);
    const updatedTable = deleteColumn(2, table);

    const rows = getRows(updatedTable);
    expect(rows.length).toBe(3);
    const [firstCell, secondCell, thirdCell] = rows[1].columns;

    expect(getCellValue(firstCell)).toBe("2; 1");
    expect(getCellCoordinates(firstCell)).toEqual([1, 0]);
    expect(getCellValue(secondCell)).toBe("2; 2");
    expect(getCellCoordinates(secondCell)).toEqual([1, 1]);
    expect(thirdCell).toBe(undefined);
  });
  test("between existed", () => {
    const table = generateTable(3, 3);
    const updatedTable = deleteColumn(1, table);

    const rows = getRows(updatedTable);
    expect(rows.length).toBe(3);
    const [firstCell, secondCell, thirdCell] = rows[1].columns;

    expect(getCellValue(firstCell)).toBe("2; 1");
    expect(getCellCoordinates(firstCell)).toEqual([1, 0]);
    expect(getCellValue(secondCell)).toBe("2; 3");
    expect(getCellCoordinates(secondCell)).toEqual([1, 1]);
    expect(thirdCell).toBe(undefined);
  });
});
