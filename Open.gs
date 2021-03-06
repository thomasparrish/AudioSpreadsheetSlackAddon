/**************************************************************
Function: onOpen
 Executes on spreadsheet open. Creates UI menu dropdown.
 
Inputs:
  e: Event data from Google spreadsheet
**************************************************************/
function onOpen(e){
    var ui = SpreadsheetApp.getUi();
    ui.createMenu("Slack")
    .addSubMenu(ui.createMenu("Settings")
        .addItem("Toggle Slack Alerts", "toggleSlack")
        .addItem("Edit Webhook URL", "EditWebhookURL")
        .addItem("Edit Slack Channel", "EditSlackChannel")
        .addItem("Show Current Configuration", "displayProperties"))
    .addSeparator()
    .addItem("Help", "Help")
    .addToUi();
}