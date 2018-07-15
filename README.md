# Slack Addon Installation Instructions

Add the slack integration code to your spreadsheet:
1) Open your copy of the Game Audio Spreadsheet Template
2) Select Tools>Script Editor
3) In the script editor, select File>New>Script file
4) Paste the contents of SlackAddon.gs into this new script file, then save

Connect the Game Audio Spreadsheet Template to your Slack channel:

Follow these instructions to generate an incoming webhook for your workspace:
https://api.slack.com/incoming-webhooks
Then:
1) Open/Reopen the Game Audio Spreadsheet Template
2) Select Slack Settings>Edit Webhook URL
3) Paste the webhook URL generated in the above guide
4) Select Slack Settings>Edit Slack Channel
5) Type the name of the channel you would like the updates to be sent to in your Slack workspace

Now, when you change the status of an event to "In [middleware]" or "In Game", 
the specified Slack channel will receive an update with information about the 
event. This is useful to let your team members know that your part of the work 
is done, and they have work to do.
