module.exports = {
    data: new SlashCommandBuilder()
      .setName('reload')
      .setDescription('Reloads all bot commands.'),
    
    async execute(interaction) {
      const commandFiles = fs.readdirSync(path.join(__dirname, '../commands')).filter(file => file.endsWith('.js'));
  
      for (const file of commandFiles) {
        const command = require(`../commands/${file}`);
        interaction.client.commands.set(command.data.name, command);
      }
  
      await interaction.reply('Commands reloaded!');
    }
  };
  