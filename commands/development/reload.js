const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('reload')
    .setDescription('Reloads a command'),
  
  async execute(interaction) {
    if (interaction.user.id !== '186117507554344960') {
      return interaction.reply('You do not have permission to use this command.');
    }
    const commandName = interaction.options.getString('command');
    const command = interaction.client.commands.get(commandName);

    if (!command) {
      return interaction.reply(`There is no command with name \`${commandName}\`!`);
    }

    delete require.cache[require.resolve(`../commands/${commandName}.js`)];

    try {
      const newCommand = require(`../commands/${commandName}.js`);
      interaction.client.commands.set(newCommand.data.name, newCommand);
      interaction.reply(`Command \`${commandName}\` was reloaded!`);
    } catch (error) {
      console.error(error);
      interaction.reply(`There was an error while reloading a command \`${commandName}\`:\n\`${error.message}\``);
    }
  }
};