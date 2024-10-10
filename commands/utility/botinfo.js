const { SlashCommandBuilder } = require('@discordjs/builders');
module.exports = {
    data: new SlashCommandBuilder()
      .setName('botinfo')
      .setDescription('Displays information about the bot.'),
  
    async execute(interaction) {
      const embed = new MessageEmbed()
        .setColor('#88d0ff')
        .setTitle('Bot Information')
        .addField('Version', '1.0.0', true)
        .addField('Creator', 'bossman', true)
        .addField('Uptime', `${interaction.client.uptime}`, true);
  
      await interaction.reply({ embeds: [embed] });
    }
  };
  