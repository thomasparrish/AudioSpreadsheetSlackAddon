/* Debug function that displays the script properties from the spreadsheet's Slack dropdown menu */
function displayProperties(){
    SpreadsheetApp.getUi().alert("Slack Toggle: "+PropertiesService.getScriptProperties().getProperty("UseSlack")+"\n"+
             "Webhook URL: "+PropertiesService.getScriptProperties().getProperty("Webhook URL")+"\n"+
             "Spreadsheet URL: "+PropertiesService.getScriptProperties().getProperty("Spreadsheet URL")+"\n"+
             "Slack Channel Name: "+PropertiesService.getScriptProperties().getProperty("Slack Channel Name"));
}

/* Debug function that allows a user to create a new Script Property */
function createProperty(){
    var ui = SpreadsheetApp.getUi();
    var key = ui.prompt("Enter the new property name");
    var value = ui.prompt("Enter the property value");
    PropertiesService.getScriptProperties().setProperty(key.getResponseText(), value.getResponseText());
}