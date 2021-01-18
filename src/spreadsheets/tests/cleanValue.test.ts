import { cleanCell, getRows, getCellValue, getCellCoordinates } from "..";
import { generateTable } from "./utils";

describe("clean value", () => {
  test("in existed cell", () => {
    const table = generateTable(3, 3);
    const updatedTable = cleanCell([1, 1], table);

    const rows = getRows(updatedTable);
    expect(rows.length).toBe(3);
    const [firstCell, secondCell, thirdCell] = rows[1].columns;

    expect(getCellValue(firstCell)).toBe("2; 1");
    expect(getCellCoordinates(firstCell)).toEqual([1, 0]);
    expect(getCellValue(secondCell)).toBe(null);
    expect(getCellCoordinates(secondCell)).toEqual([1, 1]);
    expect(getCellValue(thirdCell)).toBe("2; 3");
    expect(getCellCoordinates(thirdCell)).toEqual([1, 2]);
  });
  test("in new cell without any change in table", () => {
    const table = generateTable(3, 3);
    const updatedTable = cleanCell([5, 5], table);
    expect(updatedTable).toEqual(table);
  });
});
