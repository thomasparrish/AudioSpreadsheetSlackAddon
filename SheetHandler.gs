function DisplayParametersSheet() {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    ss.getSheetByName("Parameters").showSheet();
    ss.getSheetByName("GameSyncs").hideSheet();
}

function DisplayGameSyncsSheet() {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    ss.getSheetByName("GameSyncs").showSheet();
    ss.getSheetByName("Parameters").hideSheet();
}