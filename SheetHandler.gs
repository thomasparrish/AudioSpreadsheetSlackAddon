/**************************************************************
Function: DisplayParametersSheet
 Hides "GameSyncs" sheet and shows "Parameters" sheet.
**************************************************************/
function DisplayParametersSheet() {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    ss.getSheetByName("Parameters").showSheet();
    ss.getSheetByName("GameSyncs").hideSheet();
}

/**************************************************************
Function: DisplayParametersSheet
 Hides "Parameters" sheet and shows "GameSyncs" sheet.
**************************************************************/
function DisplayGameSyncsSheet() {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    ss.getSheetByName("GameSyncs").showSheet();
    ss.getSheetByName("Parameters").hideSheet();
}