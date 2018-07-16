var dateFormat = "M/d/yyyy";

/* Stamps dates in the "In Wwise/FMOD" column
if an event status is changed to "In Wwise"
or "In FMOD" */
function inMiddleware(sheet, event) {

    //Event Status column
    var colStatus = 3;
    
    //If the cell says "In Wwise" or "In FMOD", and is in column B
    if (event.range.getColumn() == colStatus && 
        event.value == Status[0])
    {
        //Move two columns over from the status column, and write today's date
        var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
        var now = Utilities.formatDate(new Date(), "GMT-8", dateFormat);
        sheet.getRange(event.range.getRow(), (event.range.getColumn() + 4)).setValue(now);
    }       
}

/* Stamps dates in the "In Game" column if
an event status is changed to "In Game" */
function inGame(sheet, event) {

    //Event Status column
    var colStatus = 3;
    
    if (event.range.getColumn() == colStatus && 
        event.value == Status[1])
    {
        //Move three columns over from the status column, and write today's date
        var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
        var now = Utilities.formatDate(new Date(), "GMT-8", dateFormat);
        sheet.getRange(event.range.getRow(), (event.range.getColumn() + 5)).setValue(now);
    }       
}