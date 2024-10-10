const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('setbanner')
    .setDescription('Changes the bot\'s banner')
    .addAttachmentOption(option => 
      option.setName('image')
        .setDescription('Upload the new banner image')
        .setRequired(true)
    ),

  async execute(interaction) {
    const image = interaction.options.getAttachment('image');

    if (!image) {
      return interaction.reply({ content: 'Please provide a valid image to set as the bot banner.', ephemeral: true });
    }

    try {
      await interaction.client.user.setBanner(image.url);
      await interaction.reply({ content: 'Bot banner updated successfully!', ephemeral: true });
    } catch (error) {
      console.error(error);
      await interaction.reply({ content: 'An error occurred while updating the banner.', ephemeral: true });
    }
  }
};
