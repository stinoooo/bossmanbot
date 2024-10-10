module.exports = {
    data: new SlashCommandBuilder()
      .setName('stats')
      .setDescription('Shows bot performance stats.'),
  
    async execute(interaction) {
      const usedMemory = process.memoryUsage().heapUsed / 1024 / 1024;
      const cpuUsage = process.cpuUsage().system / 1000;
  
      const embed = new MessageEmbed()
        .setColor('#88d0ff')
        .setTitle('Bot Performance Stats')
        .addField('Memory Usage', `${Math.round(usedMemory)} MB`, true)
        .addField('CPU Usage', `${Math.round(cpuUsage)} ms`, true);
  
      await interaction.reply({ embeds: [embed] });
    }
  };
  