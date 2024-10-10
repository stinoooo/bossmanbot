const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');
const { Fact } = require('../../database/factModel');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('listfacts')
    .setDescription('Lists all facts with their IDs, sent status, and sent time if applicable.'),

  async execute(interaction) {
    // Fetch all facts from the database
    const facts = await Fact.find();

    if (!facts.length) {
      const noFactsEmbed = new EmbedBuilder()
        .setColor('#ff0000')
        .setTitle('No Facts Found')
        .setDescription('There are currently no facts in the database.')
        .setTimestamp();
      return interaction.reply({ embeds: [noFactsEmbed], ephemeral: true });
    }

    // Break the facts into pages or create multiple embeds if needed for large datasets
    const factList = facts.map(fact => {
      const addedInfo = `Added on ${fact.addedAt.toDateString()} at ${fact.addedAt.toLocaleTimeString()}`;
      const sentInfo = fact.sent
        ? `Sent on ${fact.sentAt.toDateString()} at ${fact.sentAt.toLocaleTimeString()}`
        : 'Not sent yet';
      return `**ID:** ${fact.factId}\n**Fact:** ${fact.fact}\n**Added:** ${addedInfo}\n**Status:** ${sentInfo}`;
    }).join('\n\n');

    // Use an embed to display the facts
    const embed = new EmbedBuilder()
      .setColor('#88d0ff')
      .setTitle('Fun Facts')
      .setDescription(factList.length > 2048 ? factList.slice(0, 2048) : factList) // Ensure within Discord character limits
      .setTimestamp();

    await interaction.reply({ embeds: [embed], ephemeral: true });
  }
};