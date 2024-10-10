const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('setavatar')
    .setDescription('Changes the bot\'s profile picture')
    .addAttachmentOption(option => 
      option.setName('image')
        .setDescription('Upload the new avatar image')
        .setRequired(true)
    ),

  async execute(interaction) {
    const image = interaction.options.getAttachment('image');

    if (!image) {
      return interaction.reply({ content: 'Please provide a valid image to set as the bot avatar.', ephemeral: true });
    }

    try {
      await interaction.client.user.setAvatar(image.url);
      await interaction.reply({ content: 'Bot avatar updated successfully!', ephemeral: true });
    } catch (error) {
      console.error(error);
      await interaction.reply({ content: 'An error occurred while updating the avatar.', ephemeral: true });
    }
  }
};
