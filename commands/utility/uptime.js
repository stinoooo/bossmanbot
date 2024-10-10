module.exports = {
    data: new SlashCommandBuilder()
      .setName('uptime')
      .setDescription('Shows how long the bot has been online.'),
  
    async execute(interaction) {
      const uptime = interaction.client.uptime;
      const timeString = new Date(uptime).toISOString().substr(11, 8); // Format uptime to HH:MM:SS
      await interaction.reply(`Uptime: ${timeString}`);
    }
  };
  