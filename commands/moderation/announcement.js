const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('announcement')
    .setDescription('Sends an announcement to a specified channel with a tag for everyone, here, a role, or a user.')
    .addStringOption(option =>
      option.setName('message')
        .setDescription('The message to announce')
        .setRequired(true))
    .addStringOption(option =>
      option.setName('ping')
        .setDescription('Who to ping: everyone, here, role, user')
        .setRequired(true))
    .addRoleOption(option =>
      option.setName('role')
        .setDescription('The role to ping')
        .setRequired(false))
    .addUserOption(option =>
      option.setName('user')
        .setDescription('The user to ping')
        .setRequired(false)),

  async execute(interaction) {
    const message = interaction.options.getString('message');
    const pingOption = interaction.options.getString('ping');
    const role = interaction.options.getRole('role');
    const user = interaction.options.getUser('user');
    const announcementChannel = interaction.channel; // You can specify a channel here if needed

    let pingContent = '';

    // Determine who to ping based on the provided option
    if (pingOption === 'everyone') {
      pingContent = '@everyone';
    } else if (pingOption === 'here') {
      pingContent = '@here';
    } else if (pingOption === 'role' && role) {
      pingContent = `<@&${role.id}>`; // Ping the specified role
    } else if (pingOption === 'user' && user) {
      pingContent = `<@${user.id}>`; // Ping the specified user
    } else {
      pingContent = ''; // No ping if no valid option is provided
    }

    const embed = new EmbedBuilder()
      .setColor('#88d0ff')
      .setTitle('📢 Announcement')
      .setDescription(message)
      .setTimestamp();

    // Send the message with the ping
    await announcementChannel.send({ content: pingContent, embeds: [embed] });
    await interaction.reply({ content: 'Announcement sent.', ephemeral: true });
  }
};