/* Sets the "UseSlack" script property, which controls whether or not Slack features work */
function toggleSlack(){
    var ui = SpreadsheetApp.getUi();
    var properties = PropertiesService.getScriptProperties();
    var response = ui.alert("Use Slack Alerts?", 
                            "Would you like to use Slack alerts for this Spreadsheet? "+
                                "You may turn Slack alerts off at any time from this same menu.",
                            ui.ButtonSet.YES_NO_CANCEL);
    
    if (response == "YES")
    {
        properties.setProperty("UseSlack", response);
        if (properties.getProperty("Webhook URL") == null)
        {
            EditWebhookURL();
        }
        if (properties.getProperty("Slack Channel Name") == null)
        {
            EditSlackChannel();
        }
        if (properties.getProperty("Spreadsheet URL") == null)
        {
            properties.setProperty("Spreadsheet URL", SpreadsheetApp.getActiveSpreadsheet().getUrl());
        }
        deleteTriggers();
        ScriptApp.newTrigger("myOnEdit").forSpreadsheet(SpreadsheetApp.getActive()).onEdit().create();
        ui.alert("Slack alerts turned ON");
    }
    else if (response == "NO")
    {
        deleteTriggers();
        properties.setProperty("UseSlack", response);
        ui.alert("Slack alerts turned OFF");
    }
}

/* Change the webhook url that the alert should be sent to */
function EditWebhookURL(){
    var ui = SpreadsheetApp.getUi();
    var properties = PropertiesService.getScriptProperties();
    var response = ui.prompt("Enter your Slack 'incoming webhook' URL");
    properties.setProperty("Webhook URL", response.getResponseText());
    ui.alert("Webhook URL updated");
}

/* Change the name of the channel the user wants the alert sent to */
function EditSlackChannel(){
    var ui = SpreadsheetApp.getUi();
    var properties = PropertiesService.getScriptProperties();
    var response = ui.prompt("Enter the name of the Slack channel you would like to send updates to (no '#')");
    properties.setProperty("Slack Channel Name", response.getResponseText());
    ui.alert("Target Slack channel updated");
}

/* Give the user information about the service */
function Help(){
    var ui = SpreadsheetApp.getUi();
    ui.alert("To use this add-on, you must enter your Webhook URL and Slack channel name. "+
             "You can find your Webhook URL by going to the Slack Apps page for your workspace. "+
             "The channel name is the channel in your Slack workspace where you would like "+
             "the updates to be sent.");
}

/* Display the script properties from the spreadsheet's Slack dropdown menu */
function displayProperties(){
    SpreadsheetApp.getUi().alert("Receive Slack Alerts: "+PropertiesService.getScriptProperties().getProperty("UseSlack")+"\n"+
             "Webhook URL: "+PropertiesService.getScriptProperties().getProperty("Webhook URL")+"\n"+
             "Spreadsheet URL: "+PropertiesService.getScriptProperties().getProperty("Spreadsheet URL")+"\n"+
             "Slack Channel Name: "+PropertiesService.getScriptProperties().getProperty("Slack Channel Name"));
}

/* Resets triggers for the project */
function deleteTriggers() {
  var allTriggers = ScriptApp.getProjectTriggers();
  for (var i = 0; i < allTriggers.length; i++) {
    ScriptApp.deleteTrigger(allTriggers[i]);
  }
}