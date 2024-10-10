const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
      .setName('ping')
      .setDescription('Returns the bot’s latency.'),
  
    async execute(interaction) {
      const sent = await interaction.reply({ content: 'Pinging...', fetchReply: true });
      await interaction.editReply(`Pong! Latency is ${sent.createdTimestamp - interaction.createdTimestamp}ms.`);
    }
  };
  