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
          "fallback": "Audio Spreadsheet Update",   //Notification Message
          "color": color,                           //Sidebar color
          "fields":[
             {
                "title":title,                      //Title of message
                "short":false
             },
             {
                "title":"Event Name",               //Event Name
                "value": itemName,
                "short": false
             },
             {
                "title":"Description",              //Event Description
                "value": description,
                "short": false
             },
             {
                 "title":"Notes",                   //Event Notes
                 "value": notes,
                 "short": false
             },
             {
                "title":"Link",                     //Spreadsheet link
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