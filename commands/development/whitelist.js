const { SlashCommandBuilder } = require('@discordjs/builders');
const fs = require('fs');
const config = require('../../config.json');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('whitelist')
    .setDescription('Adds a user to the allowed users whitelist')
    .addUserOption(option => 
      option.setName('user')
        .setDescription('The user to whitelist')
        .setRequired(false)
    )
    .addStringOption(option => 
      option.setName('userid')
        .setDescription('The user ID to whitelist')
        .setRequired(false)
    ),

  async execute(interaction) {
    // Fetch the user or userID from the command options
    const user = interaction.options.getUser('user');
    const userId = interaction.options.getString('userid');

    // Ensure either user or userId is provided
    if (!user && !userId) {
      return interaction.reply({ content: 'You must provide either a user or a user ID to whitelist.', ephemeral: true });
    }

    const idToWhitelist = user ? user.id : userId;

    // Check if user is already whitelisted
    if (config.allowedUsers.includes(idToWhitelist)) {
      await interaction.reply({ content: `User with ID ${idToWhitelist} is already whitelisted.`, ephemeral: true });
      return;
    }

    // Add the user to the whitelist
    config.allowedUsers.push(idToWhitelist);

    // Save changes to config.json
    fs.writeFileSync('./config.json', JSON.stringify(config, null, 2));

    await interaction.reply({ content: `User with ID ${idToWhitelist} has been whitelisted.`, ephemeral: true });
  }
};