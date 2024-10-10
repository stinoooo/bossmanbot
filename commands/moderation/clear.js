module.exports = {
    data: new SlashCommandBuilder()
      .setName('clear')
      .setDescription('Clears messages.')
      .addIntegerOption(option => option.setName('number').setDescription('Number of messages to clear').setRequired(true))
      .addUserOption(option => option.setName('user').setDescription('Optional user to clear messages from')),
  
    async execute(interaction) {
      const number = interaction.options.getInteger('number');
      const user = interaction.options.getUser('user');
      
      const messages = await interaction.channel.messages.fetch({ limit: number });
      
      if (user) {
        const userMessages = messages.filter(msg => msg.author.id === user.id);
        await interaction.channel.bulkDelete(userMessages);
      } else {
        await interaction.channel.bulkDelete(messages);
      }
  
      await interaction.reply(`Deleted ${number} messages.`);
    }
  };
  