module.exports = {
    data: new SlashCommandBuilder()
      .setName('role')
      .setDescription('Assigns or removes a role from a user.')
      .addUserOption(option => option.setName('user').setDescription('The user to assign/remove role').setRequired(true))
      .addStringOption(option => option.setName('role').setDescription('Role name').setRequired(true)),
  
    async execute(interaction) {
      const user = interaction.options.getUser('user');
      const roleName = interaction.options.getString('role');
      const member = interaction.guild.members.cache.get(user.id);
      const role = interaction.guild.roles.cache.find(r => r.name === roleName);
  
      if (!role) return interaction.reply('Role not found.');
  
      if (member.roles.cache.has(role.id)) {
        await member.roles.remove(role);
        await interaction.reply(`Removed role ${role.name} from ${user.tag}`);
      } else {
        await member.roles.add(role);
        await interaction.reply(`Assigned role ${role.name} to ${user.tag}`);
      }
    }
  };
  