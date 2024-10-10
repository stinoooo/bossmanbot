const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('help')
    .setDescription('Shows all available commands categorized'),

  async execute(interaction) {
    const pages = [
      new EmbedBuilder()
        .setColor('#88d0ff')
        .setTitle('Development Commands')
        .setDescription('`/eval`, `/reload`, `/setstatus`, `/shutdown`'),

      new EmbedBuilder()
        .setColor('#88d0ff')
        .setTitle('Utility Commands')
        .setDescription('`/botinfo`, `/ping`, `/stats`, `/uptime`, `/userinfo`'),

      new EmbedBuilder()
        .setColor('#88d0ff')
        .setTitle('Moderation Commands')
        .setDescription('`/announcement`, `/clear`, `/embedsay`, `/role`, `/say`'),

      new EmbedBuilder()
        .setColor('#88d0ff')
        .setTitle('Fact Commands')
        .setDescription('`/addfact`, `/listfacts`, `/removefact`')
    ];

    let currentPage = 0;

    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId('prev')
        .setLabel('Previous')
        .setStyle(ButtonStyle.Primary)
        .setDisabled(currentPage === 0),
      new ButtonBuilder()
        .setCustomId('next')
        .setLabel('Next')
        .setStyle(ButtonStyle.Primary)
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

      const updatedRow = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setCustomId('prev')
          .setLabel('Previous')
          .setStyle(ButtonStyle.Primary)
          .setDisabled(currentPage === 0),
        new ButtonBuilder()
          .setCustomId('next')
          .setLabel('Next')
          .setStyle(ButtonStyle.Primary)
          .setDisabled(currentPage === pages.length - 1)
      );

      await i.update({ embeds: [pages[currentPage]], components: [updatedRow] });
    });

    collector.on('end', async () => {
      const disabledRow = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setCustomId('prev')
          .setLabel('Previous')
          .setStyle(ButtonStyle.Primary)
          .setDisabled(true),
        new ButtonBuilder()
          .setCustomId('next')
          .setLabel('Next')
          .setStyle(ButtonStyle.Primary)
          .setDisabled(true)
      );
      await message.edit({ components: [disabledRow] });
    });
  }
};