const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('userinfo')
    .setDescription('Provides details about a user.')
    .addUserOption(option => 
      option.setName('user')
        .setDescription('The user to get info about')
        .setRequired(true)
    ),

  async execute(interaction) {
    const user = interaction.options.getUser('user');
    const member = interaction.guild.members.cache.get(user.id);

    const embed = new EmbedBuilder()
      .setTitle(`${user.tag} Information`)
      .addFields(
        { name: 'Account Created', value: user.createdAt.toDateString(), inline: true },
        { name: 'Joined Server', value: member.joinedAt.toDateString(), inline: true },
        { name: 'Roles', value: member.roles.cache.map(role => role.name).join(', '), inline: true }
      )
      .setColor('#88d0ff');

    await interaction.reply({ embeds: [embed] });
  }
};