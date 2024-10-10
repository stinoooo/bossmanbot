const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('embedsay')
    .setDescription('Sends a message in an embed')
    .addStringOption(option => 
      option.setName('message')
        .setDescription('The message to send')
        .setRequired(true)
    ),

  async execute(interaction) {
    const message = interaction.options.getString('message');
    const embed = new EmbedBuilder()
      .setColor('#88d0ff')
      .setDescription(message);

    await interaction.reply({ content: 'Embed sent!', ephemeral: true });
    await interaction.channel.send({ embeds: [embed] });
  },
};