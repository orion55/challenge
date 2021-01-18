export { Table } from "./types";
export {
  initSpreadsheet,
  getRows,
  getCellValue,
  getFunctionalCellValue,
  getCellCoordinates,
  isFunctionalCell,
  addRow,
  addColumn,
  setCell,
  cleanCell,
  deleteColumn,
  deleteRow,
} from "./main";
export {
  setCellFunction,
  buildSumFunctionDescription,
  buildMultiplyFunctionDescription,
  buildSubtractFunctionDescription,
  buildDivideFunctionDescription,
} from "./functions";
