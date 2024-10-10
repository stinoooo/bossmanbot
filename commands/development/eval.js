module.exports = {
    data: new SlashCommandBuilder()
      .setName('eval')
      .setDescription('Executes arbitrary JavaScript code.')
      .addStringOption(option => option.setName('code').setDescription('Code to execute').setRequired(true)),
  
    async execute(interaction) {
      if (interaction.user.id !== 'YOUR_ID') return interaction.reply('You do not have permission to run this command.');
  
      const code = interaction.options.getString('code');
      try {
        const result = eval(code);
        await interaction.reply(`Result: ${result}`);
      } catch (error) {
        await interaction.reply(`Error: ${error.message}`);
      }
    }
  };
  