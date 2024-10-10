const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('help')
    .setDescription('Shows all available commands categorized'),

  async execute(interaction) {
    const pages = [
      new MessageEmbed()
        .setColor('#88d0ff')
        .setTitle('Development Commands')
        .setDescription('`/eval`, `/reload`, `/setstatus`, `/shutdown`'),

      new MessageEmbed()
        .setColor('#88d0ff')
        .setTitle('Utility Commands')
        .setDescription('`/botinfo`, `/ping`, `/stats`, `/uptime`, `/userinfo`'),

      new MessageEmbed()
        .setColor('#88d0ff')
        .setTitle('Moderation Commands')
        .setDescription('`/announcement`, `/clear`, `/embedsay`, `/role`, `/say`'),

      new MessageEmbed()
        .setColor('#88d0ff')
        .setTitle('Fact Commands')
        .setDescription('`/addfact`, `/listfacts`, `/removefact`')
    ];

    let currentPage = 0;

    const row = new MessageActionRow().addComponents(
      new MessageButton()
        .setCustomId('prev')
        .setLabel('Previous')
        .setStyle('PRIMARY')
        .setDisabled(currentPage === 0),
      new MessageButton()
        .setCustomId('next')
        .setLabel('Next')
        .setStyle('PRIMARY')
        .setDisabled(currentPage === pages.length - 1)
    );

    const message = await interaction.reply({ embeds: [pages[currentPage]], components: [row], fetchReply: true });

    const collector = message.createMessageComponentCollector({ time: 60000 });

    collector.on('collect', async i => {
      if (i.customId === 'prev') {
        currentPage--;
      } else if (i.customId === 'next') {
        currentPage++;
      }

      const updatedRow = new MessageActionRow().addComponents(
        new MessageButton()
          .setCustomId('prev')
          .setLabel('Previous')
          .setStyle('PRIMARY')
          .setDisabled(currentPage === 0),
        new MessageButton()
          .setCustomId('next')
          .setLabel('Next')
          .setStyle('PRIMARY')
          .setDisabled(currentPage === pages.length - 1)
      );

      await i.update({ embeds: [pages[currentPage]], components: [updatedRow] });
    });

    collector.on('end', async () => {
      const disabledRow = new MessageActionRow().addComponents(
        new MessageButton()
          .setCustomId('prev')
          .setLabel('Previous')
          .setStyle('PRIMARY')
          .setDisabled(true),
        new MessageButton()
          .setCustomId('next')
          .setLabel('Next')
          .setStyle('PRIMARY')
          .setDisabled(true)
      );
      await message.edit({ components: [disabledRow] });
    });
  }
};
