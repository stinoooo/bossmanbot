const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('setstatus')
    .setDescription('Changes the bot’s online status and activity')
    .addStringOption(option =>
      option.setName('status').setDescription('Set the bot’s status (online, idle, dnd)').setRequired(true)
    )
    .addStringOption(option =>
      option.setName('activitytype').setDescription('Set the activity type (PLAYING, WATCHING, LISTENING)').setRequired(true)
    )
    .addStringOption(option =>
      option.setName('activitytext').setDescription('Set the text for the activity').setRequired(true)
    ),

  async execute(interaction) {
    const status = interaction.options.getString('status');
    const activityType = interaction.options.getString('activitytype').toUpperCase();
    const activityText = interaction.options.getString('activitytext');

    if (!['online', 'idle', 'dnd'].includes(status)) {
      return interaction.reply({ content: 'Invalid status. Choose from online, idle, or dnd.', ephemeral: true });
    }

    if (!['PLAYING', 'WATCHING', 'LISTENING'].includes(activityType)) {
      return interaction.reply({ content: 'Invalid activity type. Choose from PLAYING, WATCHING, or LISTENING.', ephemeral: true });
    }

    // Set the bot's presence based on user input
    interaction.client.user.setPresence({
      status: status,
      activities: [{ name: activityText, type: activityType }],
    });

    await interaction.reply({ content: `Status set to ${status}, ${activityType.toLowerCase()} ${activityText}.`, ephemeral: true });
  },
};
