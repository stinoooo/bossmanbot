const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('say')
    .setDescription('Sends a plain text message')
    .addStringOption(option => option.setName('message').setDescription('The message to send').setRequired(true)),

  async execute(interaction) {
    const message = interaction.options.getString('message');
    await interaction.reply({ content: message, ephemeral: true });
    await interaction.channel.send(message);
  },
};