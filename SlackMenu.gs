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
    .addItem("Show Current Settings", "displayProperties")
    .addToUi();
}