# oatmeal_bot

A bot to play music on discord.

Mr. Oats needs the following intents enabled in the Discord Developer Portal:
        PRESENCE INTENT
        MESSAGE CONTENT INTENT

Mr. Oats requires a config.json file in the main folder.

This file needs to contain a a token for the bot that will be using the program.
For Development, this file should also have a client ID ("Application ID" in Discord Developer Portal under "General Information") and a guild-id you want to register commands to.

```
{
  "token": "<your-token>"
  "client_id": "<your-client-id>",
  "test_guild_id": "<your-guild-id>"
}
```
