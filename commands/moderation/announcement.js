const { SlashCommandBuilder } = require('@discordjs/builders');
module.exports = {
    data: new SlashCommandBuilder()
      .setName('announcement')
      .setDescription('Sends an announcement to a specified channel with an @everyone tag.')
      .addStringOption(option => option.setName('message').setDescription('The message to announce').setRequired(true)),
  
    async execute(interaction) {
      const message = interaction.options.getString('message');
      const announcementChannel = interaction.channel; // Replace with a specific channel if needed
  
      await announcementChannel.send(`@everyone ${message}`);
      await interaction.reply('Announcement sent.');
    }
  };
  