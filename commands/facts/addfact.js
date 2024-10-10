const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const { Fact, getNextFactId } = require('../../database/factModel');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('addfact')
    .setDescription('Adds a new fun fact to the database.')
    .addStringOption(option => 
      option.setName('fact')
        .setDescription('The fun fact you want to add')
        .setRequired(true)
    ),

  async execute(interaction) {
    // Check if the user has permission to use this command
    if (interaction.user.id !== '186117507554344960') {
      const errorEmbed = new MessageEmbed()
        .setColor('#ff0000')
        .setTitle('Permission Denied')
        .setDescription('You do not have permission to use this command.')
        .setTimestamp();

      return interaction.reply({ embeds: [errorEmbed], ephemeral: true });
    }

    // Get the fact input from the command
    const factText = interaction.options.getString('fact');

    // Check if the fact already exists in the database
    const existingFact = await Fact.findOne({ fact: factText });
    if (existingFact) {
      const existingFactEmbed = new MessageEmbed()
        .setColor('#ff0000')
        .setTitle('Fact Already Exists')
        .setDescription('This fact already exists in the database.')
        .setTimestamp();

      return interaction.reply({ embeds: [existingFactEmbed], ephemeral: true });
    }

    // Generate the next factId
    const factId = await getNextFactId();

    // Create and save the new fact
    const newFact = new Fact({
      factId,
      fact: factText,
      sent: false
    });

    await newFact.save();

    // Confirm the fact has been added using an embed
    const successEmbed = new MessageEmbed()
      .setColor('#88d0ff')
      .setTitle('Fact Added Successfully')
      .addField('Fact ID', factId.toString(), true)
      .addField('Fact', factText, true)
      .setTimestamp();

    await interaction.reply({ embeds: [successEmbed], ephemeral: true });
  }
};