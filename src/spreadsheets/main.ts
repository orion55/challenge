import {
  Table,
  Row,
  OrdinaryCell,
  Cell,
  Coordinates,
  FunctionalCell,
  FunctionalCellValue,
  FunctionalCellFields,
} from "./types";
import { setCellFunction } from "./functions";
import { range } from "./other";

export function initSpreadsheet(): Table {
  return { rows: [] };
}

export function getRows(table: Table): Array<Row> {
  return table.rows;
}

function initCell(
  rowId: number,
  columnId: number,
  value: OrdinaryCell["value"] = null
): OrdinaryCell {
  return {
    value,
    rowId,
    columnId,
    usedInFormulas: [],
  };
}

export function getCellByCoordinates(
  [rowId, columnId]: Coordinates,
  table: Table
): Cell {
  return table.rows[rowId]?.columns[columnId];
}
export function getCellValueByCoordinates(
  coordinates: Coordinates,
  table: Table
): Cell["value"] {
  return getCellByCoordinates(coordinates, table).value;
}
export function getCellValue(cell: Cell): OrdinaryCell["value"] {
  return isFunctionalCell(cell) ? cell.value.computed : cell.value;
}
export function getFunctionalCellValue({
  value,
}: FunctionalCell): FunctionalCellValue {
  return value;
}
export function isFunctionalCell(cell: Cell): cell is FunctionalCell {
  return cell.value ? cell.value.hasOwnProperty("type") : false;
}
export function isFunctionalCellValue(
  cellValue: Cell["value"]
): cellValue is FunctionalCellValue {
  return cellValue.hasOwnProperty("type");
}
export function getCellCoordinates({ rowId, columnId }: Cell): Coordinates {
  return [rowId, columnId];
}

export function addRow(
  cellValues: Array<OrdinaryCell["value"]>,
  table: Table
): Table {
  return {
    rows: table.rows.concat([
      {
        columns: cellValues.map((value, columnId) => ({
          value,
          columnId,
          rowId: table.rows.length,
          usedInFormulas: [],
        })),
        rowId: table.rows.length,
      },
    ]),
  };
}

export function addColumn(columnIndex: number, table: Table): Table {
  const currentColumnsTotal = table.rows[0]?.columns.length || 0;
  const isInSpreadsheetRange = columnIndex <= currentColumnsTotal;
  const generateAdditionalCells = (row: Row) =>
    isInSpreadsheetRange
      ? [initCell(row.rowId, columnIndex)]
      : range(columnIndex - currentColumnsTotal + 1).map((index) =>
          initCell(row.rowId, columnIndex - currentColumnsTotal + index)
        );
  return {
    rows: table.rows.map((row) => ({
      ...row,
      columns: [
        ...row.columns.slice(0, columnIndex),
        ...generateAdditionalCells(row),
        ...row.columns
          .slice(columnIndex)
          .map((cell) => ({ ...cell, columnId: cell.columnId + 1 })),
      ],
    })),
  };
}

function transformDateValue(
  value: Date,
  dateFormat?: "DATETIME" | "DATE" | "TIME"
): Date {
  switch (dateFormat) {
    case "DATETIME":
      return value;
    case "DATE":
      value.setHours(0, 0, 0, 0);
      return value;
    case "TIME":
      return new Date(
        0,
        0,
        0,
        value.getHours(),
        value.getMinutes(),
        value.getSeconds(),
        value.getMilliseconds()
      );
    case undefined:
      throw new Error(
        "Time related values are not allowed without explicit date format"
      );
  }
}

export function setCell(
  cellValue: OrdinaryCell["value"],
  coordinates: Coordinates,
  table: Table,
  dateFormat?: "DATETIME" | "DATE" | "TIME"
): Table {
  return setCellValue(cellValue, coordinates, table, dateFormat);
}

function updateDependantCells(coordinates: Coordinates, table: Table): Table {
  const changedCell = getCellByCoordinates(coordinates, table);
  return changedCell.usedInFormulas.reduce(
    (updatedTable, dependantCellCoordinates) => {
      const dependantCell = getCellByCoordinates(
        dependantCellCoordinates,
        updatedTable
      );
      if (isFunctionalCell(dependantCell)) {
        return setCellFunction(
          dependantCell.function,
          dependantCellCoordinates,
          updatedTable
        );
      }
      return updatedTable;
    },
    table
  );
}

export function setCellValue(
  cellValue: OrdinaryCell["value"] | FunctionalCellFields,
  [rowId, columnId]: Coordinates,
  table: Table,
  dateFormat?: "DATETIME" | "DATE" | "TIME"
): Table {
  const getNewCell = (): Cell => {
    const currentCell = getCellByCoordinates([rowId, columnId], table);
    const usedInFormulas = currentCell ? currentCell.usedInFormulas : [];
    if (typeof cellValue === "number" || typeof cellValue === "string") {
      return {
        rowId,
        columnId,
        value: cellValue,
        usedInFormulas,
      };
    }
    if (cellValue instanceof Date) {
      return {
        rowId,
        columnId,
        value: transformDateValue(cellValue, dateFormat),
        usedInFormulas,
      };
    }
    return {
      rowId,
      columnId,
      value: cellValue.value,
      function: cellValue.function,
      usedInFormulas,
    };
  };

  const currentColumnsTotal = table.rows[0]?.columns.length || 0;
  const currentRowsTotal = table.rows.length;
  const isCellAlreadyExists =
    table.rows.length > rowId && currentColumnsTotal > columnId;

  if (isCellAlreadyExists) {
    const updatedTable = {
      rows: table.rows.map((row, rowIndex) =>
        rowIndex === rowId
          ? {
              ...row,
              columns: [
                ...row.columns.slice(0, columnId),
                getNewCell(),
                ...row.columns.slice(columnId + 1),
              ],
            }
          : row
      ),
    };
    return updateDependantCells([rowId, columnId], updatedTable);
  }
  const generateAdditionalRow = (currentRowId: number) => ({
    rowId: currentRowId,
    columns: range(currentColumnsTotal).map((_, currentColIndex) =>
      currentRowId === rowId && currentColIndex === columnId
        ? getNewCell()
        : initCell(currentRowId, currentColIndex)
    ),
  });
  const newRows: Row[] =
    currentRowsTotal <= rowId
      ? range(rowId - currentRowsTotal + 1).map((_, currentRowIndex) =>
          generateAdditionalRow(currentRowsTotal + currentRowIndex)
        )
      : [];
  const extendedRows = table.rows.concat(newRows);
  const generateAdditionalCells = (currentRowId: number) =>
    range(columnId - currentColumnsTotal + 1).map((colId, index, full) =>
      currentRowId === rowId && index === full.length - 1
        ? getNewCell()
        : initCell(currentRowId, currentColumnsTotal + colId)
    );
  const updatedTable = {
    rows: extendedRows.map((row, rowIndex) => ({
      ...row,
      columns: row.columns.concat(
        currentColumnsTotal <= columnId ? generateAdditionalCells(rowIndex) : []
      ),
    })),
  };
  return updateDependantCells([rowId, columnId], updatedTable);
}

export function cleanCell([rowId, columnId]: Coordinates, table: Table): Table {
  const currentColumnsTotal = table.rows[0]?.columns.length || 0;
  if (table.rows.length > rowId && currentColumnsTotal > columnId) {
    return {
      rows: table.rows.map((row, rowIndex) =>
        rowIndex === rowId
          ? {
              ...row,
              columns: [
                ...row.columns.slice(0, columnId),
                initCell(rowId, columnId),
                ...row.columns.slice(columnId + 1),
              ],
            }
          : row
      ),
    };
  }
  return table;
}

export function deleteColumn(columnIndex: number, table: Table): Table {
  return {
    rows: table.rows.map((row) => ({
      ...row,
      columns: [
        ...row.columns.slice(0, columnIndex),
        ...row.columns
          .slice(columnIndex + 1)
          .map((cell) => ({ ...cell, columnId: cell.columnId - 1 })),
      ],
    })),
  };
}

export function deleteRow(rowIndex: number, table: Table): Table {
  return {
    rows: [
      ...table.rows.slice(0, rowIndex),
      ...table.rows.slice(rowIndex + 1).map((row) => ({
        ...row,
        rowId: row.rowId - 1,
        columns: row.columns.map((cell) => ({
          ...cell,
          rowId: cell.rowId - 1,
        })),
      })),
    ],
  };
}
