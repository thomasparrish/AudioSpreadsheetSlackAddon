/**************************************************************
Function: getName
  Returns the name of the relevent audio event
**************************************************************/
function getName(e){
    return e.source.getActiveSheet().getRange(e.range.getRow(), (e.range.getColumn() - 1)).getValue();
}

/**************************************************************
Function: getName
  Returns the description of the relevent audio event
**************************************************************/
function getDesc(e){
    return e.source.getActiveSheet().getRange(e.range.getRow(), (e.range.getColumn() + 2)).getValue();
}

/**************************************************************
Function: getName
  Returns the notes for the relevent audio event
**************************************************************/
function getNotes(e){
    return e.source.getActiveSheet().getRange(e.range.getRow(), (e.range.getColumn() + 3)).getValue();
}

/**************************************************************
Function: postInWwiseToSlack
  Sets message parameters and then sends message to Slack for
  audio events marked "In Wwise"
  
Inputs:
         eventName:  Audio event name
  eventDescription:  Audio event description
        eventNotes:  Audio event notes
**************************************************************/
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

/**************************************************************
Function: postInWwiseToSlack
  Sets message parameters and then sends message to Slack for
  audio events marked "In Game"
  
Inputs:
         eventName:  Audio event name
  eventDescription:  Audio event description
        eventNotes:  Audio event notes
**************************************************************/
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

/**************************************************************
Function: postResponse
  Sends audio event updates to Slack
  
Inputs:
      channel:  Name of destination text channel in Slack server
        color:  Color of message sidebar
     itemName:  Name of audio event
        title:  Title of Slack message
  description:  Audio event description
        notes:  Audio event notes
         link:  Link to audio event list spreadsheet
**************************************************************/
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