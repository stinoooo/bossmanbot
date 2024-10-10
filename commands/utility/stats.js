const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('stats')
    .setDescription('Shows bot performance stats.'),

  async execute(interaction) {
    const usedMemory = process.memoryUsage().heapUsed / 1024 / 1024;
    const cpuUsage = process.cpuUsage().system / 1000;

    const embed = new EmbedBuilder()
      .setColor('#88d0ff')
      .setTitle('Bot Performance Stats')
      .addFields(
        { name: 'Memory Usage', value: `${Math.round(usedMemory)} MB`, inline: true },
        { name: 'CPU Usage', value: `${Math.round(cpuUsage)} ms`, inline: true }
      )
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });
  }
};