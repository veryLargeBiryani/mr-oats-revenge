# oatmeal_bot

A bot to play music on discord.

Make sure you have 'nodemon' installed globally on your system if you intend to develop on this project!

Mr. Oats needs the following intents enabled in the Discord Developer Portal:
- PRESENCE INTENT
- MESSAGE CONTENT INTENT

Mr. Oats requires a config.json file in the root, containing a token for the bot that will be using the program.
To run in development mode, this file should have a client ID ("Application ID" in Discord Developer Portal under "General Information") and a guild-id you want to register commands to. Commands must be registered before the bot can run in dev mode. Just run the command-registry.js script in the root.

Example config.json:
```
{
  "token": "<your-token>",
  "client_id": "<your-client-id>",
  "test_guild_id": "<your-guild-id>",
  "PORT": <desired-port>
}
```
Mr. Oats uses play-dl to stream music from youtube or soundcloud. To avoid issues such as age restriction, you will need to [save cookies to your project folder](https://github.com/play-dl/play-dl/tree/main/instructions). 
