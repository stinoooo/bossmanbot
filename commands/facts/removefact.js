const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const { Fact } = require('../../database/factModel');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('removefact')
    .setDescription('Removes a fun fact by ID or fact text.')
    .addStringOption(option => 
      option.setName('factid')
        .setDescription('The ID of the fact to remove')
        .setRequired(false)
    )
    .addStringOption(option => 
      option.setName('fact')
        .setDescription('The fact text to remove')
        .setRequired(false)
    ),

  async execute(interaction) {
    const factId = interaction.options.getString('factid');
    const factText = interaction.options.getString('fact');

    // Check if at least one of the options is provided
    if (!factId && !factText) {
      const errorEmbed = new MessageEmbed()
        .setColor('#ff0000')
        .setTitle('Error')
        .setDescription('Please provide either a fact ID or a fact text.')
        .setTimestamp();

      return interaction.reply({ embeds: [errorEmbed], ephemeral: true });
    }

    let removedFact;
    if (factId) {
      // Remove by ID
      removedFact = await Fact.findOneAndDelete({ factId: factId });
    } else if (factText) {
      // Remove by fact text
      removedFact = await Fact.findOneAndDelete({ fact: factText });
    }

    if (removedFact) {
      const successEmbed = new MessageEmbed()
        .setColor('#88d0ff')
        .setTitle('Fact Removed')
        .addField('Fact', removedFact.fact, true)
        .addField('Fact ID', removedFact.factId.toString(), true)
        .setTimestamp();

      await interaction.reply({ embeds: [successEmbed], ephemeral: true });
    } else {
      const noFactFoundEmbed = new MessageEmbed()
        .setColor('#ff0000')
        .setTitle('Error')
        .setDescription('No fact found with the provided details.')
        .setTimestamp();

      await interaction.reply({ embeds: [noFactFoundEmbed], ephemeral: true });
    }
  }
};