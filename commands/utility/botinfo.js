const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');
const ms = require('ms'); // Optional utility for better time formatting, or use a custom formatter

module.exports = {
  data: new SlashCommandBuilder()
    .setName('botinfo')
    .setDescription('Displays information about the bot.'),

  async execute(interaction) {
    const uptime = ms(interaction.client.uptime, { long: true }); // Formats uptime in a readable way (optional, can use your own formatter)

    const embed = new EmbedBuilder()
      .setColor('#88d0ff')
      .setTitle('Bot Information')
      .addFields(
        { name: 'Version', value: '1.0.0', inline: true },
        { name: 'Creator', value: 'bossman', inline: true },
        { name: 'Uptime', value: uptime, inline: true }
      )
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });
  }
};