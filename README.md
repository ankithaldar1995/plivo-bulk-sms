# plivo-bulk-sms
Small utility to send sms in bulk using plivo

# How to run 
1. clone this repo
1. npm install
3. node messenger.js

# Config
You can set the following values in config.json :<br><br>
1. message - Text to send<br>
2. plivo auth_id and auth_token<br>
3. batch_size - Number of messages to be sent in a single request<br>
4. source_file - Absolute/Relative path of the file containing a list of phone numbers<br>

