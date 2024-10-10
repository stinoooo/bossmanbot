module.exports = {
    data: new SlashCommandBuilder()
      .setName('userinfo')
      .setDescription('Provides details about a user.')
      .addUserOption(option => option.setName('user').setDescription('The user to get info about').setRequired(true)),
  
    async execute(interaction) {
      const user = interaction.options.getUser('user');
      const member = interaction.guild.members.cache.get(user.id);
  
      const embed = new MessageEmbed()
        .setTitle(`${user.tag} Information`)
        .addField('Account Created', user.createdAt.toDateString(), true)
        .addField('Joined Server', member.joinedAt.toDateString(), true)
        .addField('Roles', member.roles.cache.map(role => role.name).join(', '), true)
        .setColor('#88d0ff');
  
      await interaction.reply({ embeds: [embed] });
    }
  };
  