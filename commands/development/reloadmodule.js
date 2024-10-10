const { SlashCommandBuilder } = require('@discordjs/builders');
const fs = require('fs');
const path = require('path');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('reloadmodule')
    .setDescription('Reloads a specific module/category of commands.')
    .addStringOption(option => 
      option.setName('module')
        .setDescription('The name of the module/category to reload')
        .setRequired(true)
    ),

  async execute(interaction) {
    const moduleName = interaction.options.getString('module');
    const modulePath = path.join(__dirname, '..', moduleName);

    if (!fs.existsSync(modulePath)) {
      return interaction.reply({ content: `Module "${moduleName}" not found.`, ephemeral: true });
    }

    const commandFiles = fs.readdirSync(modulePath).filter(file => file.endsWith('.js'));

    for (const file of commandFiles) {
      delete require.cache[require.resolve(path.join(modulePath, file))];
      const command = require(path.join(modulePath, file));
      interaction.client.commands.set(command.data.name, command);
    }

    await interaction.reply(`Module "${moduleName}" reloaded.`);
  }
};
