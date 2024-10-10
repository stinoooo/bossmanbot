const { SlashCommandBuilder } = require('@discordjs/builders');
const fs = require('fs');
const config = require('../../config.json');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('removewhitelist')
    .setDescription('Removes a user from the allowed users whitelist')
    .addUserOption(option => 
      option.setName('user')
        .setDescription('The user to remove from whitelist')
        .setRequired(false)
    )
    .addStringOption(option => 
      option.setName('userid')
        .setDescription('The user ID to remove from whitelist')
        .setRequired(false)
    ),

  async execute(interaction) {
    // Fetch the user or userID from the command options
    const user = interaction.options.getUser('user');
    const userId = interaction.options.getString('userid');

    // Ensure either user or userId is provided
    if (!user && !userId) {
      return interaction.reply({ content: 'You must provide either a user or a user ID to remove from whitelist.', ephemeral: true });
    }

    const idToRemove = user ? user.id : userId;

    // Check if the user is in the whitelist
    if (!config.allowedUsers.includes(idToRemove)) {
      await interaction.reply({ content: `User with ID ${idToRemove} is not in the whitelist.`, ephemeral: true });
      return;
    }

    // Remove the user from the whitelist
    config.allowedUsers = config.allowedUsers.filter(id => id !== idToRemove);

    // Save changes to config.json
    fs.writeFileSync('./config.json', JSON.stringify(config, null, 2));

    await interaction.reply({ content: `User with ID ${idToRemove} has been removed from the whitelist.`, ephemeral: true });
  }
};