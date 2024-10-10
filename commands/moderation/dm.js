const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');
const sleep = require('../../utils/sleep'); // Custom sleep utility to handle delay
const ms = require('ms');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('dm')
    .setDescription('Sends a direct message to a user, multiple users, a role, or everyone.')
    .addUserOption(option => 
      option.setName('user')
        .setDescription('The user to DM')
        .setRequired(false))
    .addStringOption(option => 
      option.setName('role')
        .setDescription('Role to DM')
        .setRequired(false))
    .addBooleanOption(option => 
      option.setName('all')
        .setDescription('DM all users')
        .setRequired(false))
    .addStringOption(option => 
      option.setName('message')
        .setDescription('The message to send')
        .setRequired(true)),

  async execute(interaction) {
    const user = interaction.options.getUser('user');
    const role = interaction.options.getString('role');
    const all = interaction.options.getBoolean('all');
    const messageContent = interaction.options.getString('message');
    const embedColor = '#88d0ff';

    let recipients = [];

    if (user) {
      recipients.push(user);
    } else if (role) {
      const roleMembers = interaction.guild.roles.cache.find(r => r.name === role).members;
      recipients = [...roleMembers.values()];
    } else if (all) {
      recipients = interaction.guild.members.cache.filter(member => !member.user.bot).array();
    }

    if (recipients.length === 0) return interaction.reply('No valid recipients found.');

    await interaction.reply(`Directly messaging ${recipients.length} out of ${interaction.guild.memberCount} members...`);

    let successCount = 0;
    let failureCount = 0;

    for (const recipient of recipients) {
      try {
        const embed = new EmbedBuilder()
          .setColor(embedColor)
          .setTitle('Direct Message')
          .setDescription(messageContent);

        await recipient.send({ embeds: [embed] });
        successCount++;
      } catch (error) {
        failureCount++;
      }

      await sleep(2000); // Add a delay between messages to avoid rate limiting
    }

    const logEmbed = new EmbedBuilder()
      .setColor(embedColor)
      .setTitle('DM Log')
      .setDescription(`DM Summary`)
      .addFields(
        { name: 'Success', value: `${successCount} DMs sent`, inline: true },
        { name: 'Failed', value: `${failureCount} DMs failed`, inline: true }
      )
      .setTimestamp();

    const logChannel = interaction.guild.channels.cache.get('1293876729668173868');
    await logChannel.send({ embeds: [logEmbed] });
  }
};