const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('avatar')
    .setDescription('Enlarges and displays a user\'s avatar and banner')
    .addUserOption(option => 
      option.setName('user')
        .setDescription('The user to view the avatar and banner of')
        .setRequired(false)
    ),

  async execute(interaction) {
    const user = interaction.options.getUser('user') || interaction.user;

    try {
      const member = await interaction.guild.members.fetch(user.id);
      const avatarUrl = member.user.displayAvatarURL({ dynamic: true, size: 1024 });
      const bannerUrl = member.user.bannerURL({ dynamic: true, size: 1024 });

      const embed = new EmbedBuilder()
        .setColor('#88d0ff')
        .setTitle(`${user.tag}'s Avatar & Banner`)
        .setDescription(`Avatar: [Link](${avatarUrl})${bannerUrl ? `\nBanner: [Link](${bannerUrl})` : '\nNo banner available.'}`)
        .setImage(avatarUrl);

      if (bannerUrl) {
        embed.setImage(bannerUrl);
      }

      await interaction.reply({ embeds: [embed] });
    } catch (error) {
      console.error(error);
      await interaction.reply({ content: 'An error occurred while fetching the user\'s profile.', ephemeral: true });
    }
  }
};