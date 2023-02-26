# oatmeal_bot

A bot to play music on discord.

Mr. Oats needs the following intents enabled in the Discord Developer Portal:
        PRESENCE INTENT
        MESSAGE CONTENT INTENT

Mr. Oats requires a config.json file in the root, containing a token for the bot that will be using the program.
To run in development mode, this file should have a client ID ("Application ID" in Discord Developer Portal under "General Information") and a guild-id you want to register commands to.

Example config.json:
```
{
  "token": "<your-token>"
  "client_id": "<your-client-id>",
  "test_guild_id": "<your-guild-id>"
}
```
Mr. Oats uses play-dl to stream music from youtube or soundcloud. To avoid issues such as age restriction, you will need to [save cookies to your project folder](https://github.com/play-dl/play-dl/tree/main/instructions). 