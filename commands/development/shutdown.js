const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
      .setName('shutdown')
      .setDescription('Shuts down the bot safely.'),
  
    async execute(interaction) {
      await interaction.reply('Shutting down...');
      process.exit();
    }
  };
  