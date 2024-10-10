const { Client, GatewayIntentBits, Collection, EmbedBuilder, ActionRowBuilder, ButtonBuilder } = require('discord.js');
const { scheduleMessages } = require('./utils/scheduler');
const { connectDB } = require('./database/factModel');
const fs = require('fs');
const path = require('path');

// Use environment variables for sensitive information (Railway, Heroku, etc.)
const token = process.env.TOKEN;  // Get token from Railway environment variable
const mongoURI = process.env.MONGO_URI;  // Get MongoDB URI from Railway environment variable
const config = require('./config.json');  // config.json only stores allowed users now

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.DirectMessages],
  partials: ['CHANNEL'] // Necessary to handle direct messages
});

client.commands = new Collection();

// Dynamically load commands from subfolders
const commandFolders = fs.readdirSync(path.join(__dirname, 'commands'));

for (const folder of commandFolders) {
  const commandFiles = fs.readdirSync(path.join(__dirname, 'commands', folder)).filter(file => file.endsWith('.js'));

  for (const file of commandFiles) {
    const command = require(`./commands/${folder}/${file}`);
    client.commands.set(command.data.name, { ...command, folder });
  }
}

client.on('interactionCreate', async interaction => {
  if (!interaction.isCommand()) return;

  const command = client.commands.get(interaction.commandName);

  if (!command) return;

  // Check if the user is allowed to execute the command
  if (!config.allowedUsers.includes(interaction.user.id)) {
    const embed = new EmbedBuilder()
      .setColor('#ff0000')
      .setTitle('Permission Denied')
      .setDescription('You do not have permission to use this command.')
      .setTimestamp();

    await interaction.reply({ embeds: [embed], ephemeral: true });
    return;
  }

  // Restrict access to the "facts" and "development" subfolders
  if (command.folder === 'facts' || command.folder === 'development') {
    const embed = new EmbedBuilder()
      .setColor('#ff0000')
      .setTitle('Permission Denied')
      .setDescription('You do not have permission to use this command from the restricted folders.')
      .setTimestamp();

    await interaction.reply({ embeds: [embed], ephemeral: true });
    return;
  }

  // Execute the command
  try {
    await command.execute(interaction);
  } catch (error) {
    console.error(error);

    const embed = new EmbedBuilder()
      .setColor('#ff0000')
      .setTitle('Error')
      .setDescription('There was an error executing this command.')
      .setTimestamp();

    await interaction.reply({ embeds: [embed], ephemeral: true });
  }
});

// Handle direct messages
client.on('messageCreate', async message => {
  if (message.channel.type === 'DM' && !message.author.bot) {
    const embed = new EmbedBuilder()
      .setColor('#88d0ff')
      .setTitle('Sorry, I can\'t respond to direct messages')
      .setDescription(`
        Unfortunately, I am unable to read or reply to your messages here. 
        If you meant to message the **BUK Moderation team** or **bossman**, you can do so using the buttons below.
        Please note that **bossman's DMs** are always closed to non-friends, and he rarely accepts friend requests.
      `)
      .setTimestamp();

    const row = new ActionRowBuilder()
      .addComponents(
        new ButtonBuilder()
          .setLabel('Contact BUK Modmail')
          .setStyle('Link')
          .setURL('https://discordapp.com/channels/@me/1282748337711353927'),
        new ButtonBuilder()
          .setLabel('Message Bossman')
          .setStyle('Link')
          .setURL('https://discordapp.com/channels/@me/915737986077974548')
      );

    await message.reply({ embeds: [embed], components: [row] });
  }
});

// Initialize the bot, connect to the database using environment variables, and set the default status
client.once('ready', async () => {
    await connectDB(mongoURI);  // Pass the MongoDB URI from environment variables
    console.log(`Logged in as ${client.user.tag}`);
  
    // Set default status to 'Listening to bossman' and online status to 'idle'
    client.user.setPresence({
      status: 'idle',
      activities: [{ name: 'bossman', type: 'LISTENING' }],
    });
  
    scheduleMessages(client);
  });
  
  

// Log in using the token from environment variables
client.login(token);