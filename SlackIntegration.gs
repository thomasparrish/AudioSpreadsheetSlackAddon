/************************************************************
Slack Integration for Game Audio Spreadsheet Template
Author: Thomas Parrish

This script gets information about an event marked as
"In Middleware" or "In Game", and sends that information
to Slack.
************************************************************/

/* Add custom UI menu */
function onOpen(e){
    var ui = SpreadsheetApp.getUi();
    ui.createMenu("Slack")
    .addSubMenu(ui.createMenu("Settings")
        .addItem("Toggle Slack Alerts", "toggleSlack")
        .addItem("Edit Webhook URL", "EditWebhookURL")
        .addItem("Edit Slack Channel", "EditSlackChannel"))
    .addSeparator()
    .addItem("Help", "Help")
    .addItem("Display Properties", "displayProperties")
    .addItem("Create Property", "createProperty")
    .addToUi();
}

/* Resets triggers for the project */
function deleteTriggers() {
  var allTriggers = ScriptApp.getProjectTriggers();
  for (var i = 0; i < allTriggers.length; i++) {
    ScriptApp.deleteTrigger(allTriggers[i]);
  }
}

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
        if (properties.getProperty("Webhook URL") == "Not Set")
        {
            EditWebhookURL();
        }
        if (properties.getProperty("Slack Channel Name") == "Not Set")
        {
            EditSlackChannel();
        }
        deleteTriggers();
        ScriptApp.newTrigger("myOnEdit")
                 .forSpreadsheet(SpreadsheetApp.getActive())
                 .onEdit()
                 .create();
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

/* Get event name */
function getName(e){
    return e.source.getActiveSheet().getRange(e.range.getRow(), (e.range.getColumn() - 1)).getValue();
}

/* Get the event description */
function getDesc(e){
    return e.source.getActiveSheet().getRange(e.range.getRow(), (e.range.getColumn() + 2)).getValue();
}

/* Get the event notes */
function getNotes(e){
    return e.source.getActiveSheet().getRange(e.range.getRow(), (e.range.getColumn() + 3)).getValue();
}

/* Send update to slack of the event that was created in middleware */
function postInWwiseToSlack(eventName, eventDescription, eventNotes){
    var properties = PropertiesService.getScriptProperties();                                             //Gets list of script properties
    var channel = properties.getProperty("Slack Channel Name");                                           //Retrieve the Slack channel to post update in
    var title = "A new event has been created in "+                                                       //Title of the Slack update post
                SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Home").getRange('N5').getValue();
    var itemName = eventName;                                                                             //Name of the event
    var description = eventDescription;                                                                   //Description of the event
    var notes = eventNotes;                                                                               //Notes for the event
    var color = "#00B9FF";                                                                                //Color for the Slack update post
    var link = properties.getProperty("Spreadsheet URL");                                                 //Link to the spreadsheet
    
    //Send message to slack
    postResponse(channel, color, itemName, title, description, notes, link);
}

/* Send update to Slack about the event that was implemented into the game */
function postInGameToSlack(eventName, eventDescription, eventNotes){
    var properties = PropertiesService.getScriptProperties();        //Gets list of script properties
    var channel = properties.getProperty("Slack Channel Name");      //Retrieve the Slack channel to post update in
    var title = "A new event has been implemented into the game";    //Title of the Slack update post
    var itemName = eventName;                                        //Name of the event
    var description = eventDescription;                              //Description of the event
    var notes = eventNotes;                                          //Notes for the event
    var color = "#24E969"                                            //Color for the Slack update post
    var link = properties.getProperty("Spreadsheet URL");            //Link to the spreadsheet
    
    //Send message to slack
    postResponse(channel, color, itemName, title, description, notes, link);
}

/* Function that takes the event information, and sends it to the user-entered URL */
function postResponse(channel, color, itemName, title, description, notes, link) {
  
  var properties = PropertiesService.getScriptProperties();
  var HookURL = properties.getProperty("Webhook URL");
  
  var payload = {
    "channel": "#" + channel,
    "attachments":[
       {
          "fallback": "Oops, Tom sucks",   //Fallback message in case of error
          "color": color,                  //Sidebar color
          "fields":[
             {
                "title":title,             //Title of message
                "short":false
             },
             {
                "title":"Event Name",      //Event Name
                "value": itemName,
                "short": false
             },
             {
                "title":"Description",     //Event Description
                "value": description,
                "short": false
             },
             {
                 "title":"Notes",          //Event Notes
                 "value": notes,
                 "short": false
             },
             {
                "title":"Link",            //Spreadsheet link
                "value": link,
                "short": false
             }
          ]
       }
    ]
  };
 
  var options = {
    'method': 'post',
    'payload': JSON.stringify(payload)
  };

  return UrlFetchApp.fetch(HookURL,options);
}