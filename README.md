# bossman

**bossman** is a Discord bot made by bossman.

## Features

- **Moderation**: Role management, message clearing, announcements, and more.
- **Utility**: Commands to get server statistics, bot info, and uptime tracking.
- **Facts**: Ability to manage a fun fact system with scheduled messages (Good Morning and Good Night messages with random facts).
- **Admin Commands**: Full control over bot commands and system management.
- **Dynamic Command Handling**: Commands are organized in subfolders for better structure and scalability.

## Commands

### 1. **Development Commands**
- `/eval`: Executes JavaScript code.
- `/reload`: Reloads all bot commands.
- `/setstatus`: Sets the bot’s status.
- `/shutdown`: Safely shuts down the bot.
- `/reloadmodule`: Reloads a specific module/category of commands.

### 2. **Moderation Commands**
- `/announcement`: Sends an announcement with an @everyone tag.
- `/clear`: Deletes a specific number of messages.
- `/embedsay`: Sends a message as an embed.
- `/role`: Assigns or removes a role from a user.
- `/say`: Sends a plain text message.

### 3. **Facts Commands**
- `/addfact`: Adds a new fun fact to the database.
- `/listfacts`: Lists all available facts with their sent status.
- `/removefact`: Removes a fun fact by its ID or text.

### 4. **Utility Commands**
- `/help`: Displays all available commands, categorized with pagination.
- `/botinfo`: Displays information about the bot.
- `/ping`: Returns the bot’s latency.
- `/stats`: Displays bot performance stats like memory usage and CPU load.
- `/uptime`: Shows how long the bot has been online.
- `/userinfo`: Provides detailed information about a user.
