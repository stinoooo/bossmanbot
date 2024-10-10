const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('uptime')
    .setDescription('Shows how long the bot has been online.'),

  async execute(interaction) {
    const uptime = interaction.client.uptime;
    const timeString = new Date(uptime).toISOString().substr(11, 8); // Format uptime to HH:MM:SS

    const embed = new EmbedBuilder()
      .setTitle('Bot Uptime')
      .setDescription(`Uptime: \`${timeString}\``)
      .setColor('#88d0ff')
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });
  }
};