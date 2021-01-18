import { Table, initSpreadsheet, addRow } from "..";
import { range } from "../other";

export function generateTable(rows: number, columns: number): Table {
    let table = initSpreadsheet();
    for (var i = 0; i < rows; i++) {
      table = addRow(
        range(columns).map((colId) => `${i + 1}; ${colId + 1}`),
        table
      );
    }
    return table;
  }
  
 export function generateNumericTable(rows: number, columns: number): Table {
    let table = initSpreadsheet();
    for (var i = 0; i < rows; i++) {
      table = addRow(
        range(columns).map((colId) => Number(`${i + 1}${colId + 1}`)),
        table
      );
    }
    return table;
  }
  