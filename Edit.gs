/* onEdit trigger for the game audio spreadsheet */

var Status = [
    "In "+SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Home").getRange('N5').getValue(),
    "In Game"
];

function onEdit(e){
    if (e.source.getActiveSheet().getName() == "TagList"){
    
        //Column that the tags are in
        var colTag = 2;
        
        //Sort the tag column
        if (e.range.getColumn() == colTag){
            var tagRange = e.source.getActiveSheet().getRange("B6:C");
            tagRange.sort( { column : colTag } );
        }
    }
    else if (e.source.getActiveSheet().getName() == "MUS" || 
             e.source.getActiveSheet().getName() == "SFX" || 
             e.source.getActiveSheet().getName() == "VO") 
    {
        //If an item was marked as "In Middleware", date stamp it
        inMiddleware(e.source.getActiveSheet(), e);
            
        //If an item was marked as "In Game", date stamp it
        inGame(e.source.getActiveSheet(), e);
    } 
    else if (e.source.getActiveSheet().getName() == "Home" &&
             e.range.getColumn() == 14 && e.range.getRow() == 5)
    {
        if (e.value == "Wwise")
        {
            Logger.log("Is Wwise");
            DisplayGameSyncsSheet();
        }
        else
        {
            Logger.log("Is other");
            DisplayParametersSheet();
        }
    }
}

/* Custom onEdit trigger needed to send data to Slack */
function myOnEdit(e){
    if (PropertiesService.getScriptProperties().getProperty("UseSlack") == "YES" && 
        e.source.getActiveSheet().getName() == "SFX" || 
        e.source.getActiveSheet().getName() == "MUS" || 
        e.source.getActiveSheet().getName() == "VO")
    {
        //If the value was changed to "In Middleware"
        if (e.value == Status[0])
        {
            //Get the information about this event that we want to send to Slack
            var eventName = getName(e);
            var eventDescription = getDesc(e);
            var eventNotes = getNotes(e);
            //Send information to Slack
            postInWwiseToSlack(eventName, eventDescription, eventNotes);
        }
        //If the value was changed to "In Game"
        else if (e.value == Status[1])
        {
            //Get the information about this event that we want to send to Slack
            var eventName = getName(e);
            var eventDescription = getDesc(e);
            var eventNotes = getNotes(e);
            //Send information to Slack
            postInGameToSlack(eventName, eventDescription, eventNotes);
        }
    }
}