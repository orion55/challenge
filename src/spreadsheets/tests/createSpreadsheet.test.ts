import { getRows, initSpreadsheet } from "..";

describe("create spreadsheet", () => {
  test("with no values", () => {
    expect(getRows(initSpreadsheet())).toEqual([]);
  });
});
