# Aspera Javascript Client App (Sample)

This sample app is based on the code from the aspera demo examples.

##Prerequisites:

* Have an SSH account created on the DTN
* Enterprise server must have connect and node enabled
Setup Connect server on your DTN
  * [Connect Server Web UI](Setuphttp://download.asperasoft.com/download/docs/entsrv/3.5.4/cs_admin_linux/webhelp/index.html#dita/web_ui.html)
* Setup Connect Users (Optional)
  * [Managing Users](http://download.asperasoft.com/download/docs/entsrv/3.5.4/cs_admin_linux/webhelp/index.html#dita/managing_users_and_groups.html)
  * **Troubleshooting:** You can test your connect server by logging in with your web user at `http://<hostname>/aspera/user`
* Setup Node API
  * [Managing the Node API](http://download.asperasoft.com/download/docs/entsrv/3.5.4/cs_admin_linux/webhelp/index.html#dita/managing_node_api.html)
  * **Troubleshooting:** You can test your node api using the following command
`curl -ki -u <user>:<password>https://<hostname>:9092/info`
* Install the Connect Plugin for your OS
  * [Downloads](http://downloads.asperasoft.com/en/downloads/8?list)
  * **Troubleshooting:** When using the connect plugin you can check the ascp commands by looking at the logs: https://support.asperasoft.com/entries/20863226-Where-are-the-Connect-logs-located-

## Installation Instructions

Clone Repository

```
git clone https://github.com/theeban275/aspera_js_sample_app.git
```

Open webpage in browser

```
cd aspera_js_sample_app && firefox index.html
```
