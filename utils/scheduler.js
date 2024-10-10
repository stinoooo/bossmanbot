const { MessageEmbed } = require('discord.js');
const { Fact, getNextFactId } = require('../database/factModel');

// Schedule messages
function scheduleMessages(client) {
  const now = new Date();
  const morningTime = new Date(now.setHours(8, 0, 0, 0));
  const nightTime = new Date(now.setHours(23, 30, 0, 0));

  setTimeout(async () => {
    await sendScheduledMessage(client, 'Good Morning', 'morning');
    setInterval(() => sendScheduledMessage(client, 'Good Morning', 'morning'), 24 * 60 * 60 * 1000); // Repeat every 24h
  }, morningTime - Date.now());

  setTimeout(async () => {
    await sendScheduledMessage(client, 'Good Night', 'night');
    setInterval(() => sendScheduledMessage(client, 'Good Night', 'night'), 24 * 60 * 60 * 1000); // Repeat every 24h
  }, nightTime - Date.now());
}

// Send a scheduled message (Good morning/night)
async function sendScheduledMessage(client, subject, type) {
  const channel = client.guilds.cache
    .get('1225923654207016961') // Guild ID for Good Morning/Good Night
    .channels.cache.get('1225944230921506846'); // Channel ID for Good Morning/Good Night

  const unsentFacts = await Fact.find({ sent: false }).limit(1);

  if (!unsentFacts.length) {
    console.log('No more facts available!');
    await notifyNoFactsLeft(client); // Notify when no facts are left
    return;
  }

  const fact = unsentFacts[0];
  fact.sent = true;
  fact.sentAt = new Date();
  await fact.save();

  // Construct the proper message content based on type (morning or night)
  const cc = '**CC:** <@559503771944747019>, <@600193358266368010>, <@849367623362936842>, <@358280863634685954> <@425982646464675847>';
  const bcc = '**BCC:** <@446348391325237248>, <@582200257816035340>';
  const fwd = '**FWD:** <@281904932548771840>, <@700656787807928351>, <@198890577578819585>, <@216311748947345408> <@244858263479386112>';

  const subjectLine = `**Subject:** ${subject} from bossman`;
  const hello = `
    Hello <@591748649994944572>, <@728386092348473456>, <@479417477621874689>, <@70867011864891392>, <@612589592666832937>, <@643885688848252930>, <@786685851849195570>, <@587805024806240266>, <@771524837201936434>, <@404400885498642452>, <@365518441635119106>, <@469218737489313793>, <@198040240022093824>, <@456545877138341898>, <@260143258548699146>, <@517051496769126400>, <@927781036413288488>, <@1063039105157562419>, <@419822730356195329> <@480220770232958997>, <@762222271544295434>, <@816674399301533747>, <@156789245132931072>, <@1166814089075494954>, <@172043884736544768>, <@483295957958656010>, <@789915701267267584, <@667545516242108428>, <@744320750999175209>, <@1242635793307275387>, <@1196511590267240500>, <@911323669609992273>, <@693165268582662145>, <@610910727275806741>.`;

  // Morning/Night Message
  const messageContent = type === 'morning'
    ? 'Good morning everyone, I hope you all have a great day today, and I hope you all slept well last night!!!'
    : 'Good night everyone, I hope you all had a great day today, and I hope you all sleep well tonight!!!';

  const factMessage = `-# **Fun Fact:** ${fact.fact}`;

  // Final formatted message
  const fullMessage = `
    ${cc}

    ${bcc}

    ${fwd}

    ${subjectLine}

    ${hello}

    ${messageContent}

    ${factMessage}
  `;

  // Create an embed for logging purposes
  const embed = new MessageEmbed()
    .setColor('#88d0ff')
    .setTitle(subject)
    .setDescription(fullMessage)
    .setFooter(`Fact ID: ${fact.factId}`);

  // Send the actual message and embed
  const sentMessage = await channel.send(fullMessage);
  await channel.send({ embeds: [embed] });

  // Log sent message details
  await logSentFact(client, fact, sentMessage);

  // Check how many facts are left and notify if less than 10
  const remainingFacts = await Fact.countDocuments({ sent: false });
  if (remainingFacts === 10) {
    await notifyLowFacts(client, remainingFacts);
  }
}

// Log sent fact details in the specific server and channel
async function logSentFact(client, fact, message) {
  const logChannel = client.channels.cache.get('1293845754598920223'); // Channel for logging sent facts

  const logEmbed = new MessageEmbed()
    .setColor('#88d0ff')
    .setTitle('Fact Sent')
    .addField('Fact ID', fact.factId.toString(), true)
    .addField('Fact', fact.fact, true)
    .addField('Date', fact.sentAt.toDateString(), true)
    .addField('Time', fact.sentAt.toLocaleTimeString(), true)
    .addField('Message Link', `[Jump to message](${message.url})`, true)
    .addField('Remaining Facts', (await Fact.countDocuments({ sent: false })).toString(), true);

  await logChannel.send({ embeds: [logEmbed] });
}

// Notify when facts are running low
async function notifyLowFacts(client, remainingFacts) {
  const daysLeft = Math.floor(remainingFacts / 2); // 2 facts per day
  const notificationChannel = client.channels.cache.get('1293839644739375104'); // Low fact count alert channel

  const embed = new MessageEmbed()
    .setColor('#88d0ff')
    .setTitle('Low Fact Count Alert')
    .setDescription(`Only **${remainingFacts} facts** are left. That's enough for **${daysLeft} days**. Please use the /addfact command to add more facts.`)
    .addField('Repository', '[Click here to view the repository](https://github.com/stinoooo/bossmanbot)', false);

  await notificationChannel.send(`<@186117507554344960>`, { embeds: [embed] });
}

// Notify when no facts are left
async function notifyNoFactsLeft(client) {
  const noFactsChannel = client.channels.cache.get('1293869589897150484'); // Alert channel when no facts are left

  const embed = new MessageEmbed()
    .setColor('#ff0000')
    .setTitle('No Facts Left')
    .setDescription('There are no unsent facts remaining. Please add new facts using the /addfact command.')
    .addField('Repository', '[Click here to view the repository](https://github.com/stinoooo/bossmanbot)', false)
    .setTimestamp();

  await noFactsChannel.send(`<@186117507554344960>`, { embeds: [embed] });
}

// Log added facts in the specific server and channel
async function logFactAdded(client, fact) {
  const logChannel = client.channels.cache.get('1293845811150721075'); // Channel for logging added facts

  const embed = new MessageEmbed()
    .setColor('#88d0ff')
    .setTitle('New Fact Added')
    .addField('Fact ID', fact.factId.toString(), true)
    .addField('Fact', fact.fact, true)
    .addField('Added At', fact.addedAt.toDateString() + ' ' + fact.addedAt.toLocaleTimeString(), true);

  await logChannel.send({ embeds: [embed] });
}

// Log removed facts in the specific server and channel
async function logFactRemoved(client, fact) {
  const logChannel = client.channels.cache.get('1293845825885306941'); // Channel for logging removed facts

  const embed = new MessageEmbed()
    .setColor('#ff0000')
    .setTitle('Fact Removed')
    .addField('Fact ID', fact.factId.toString(), true)
    .addField('Fact', fact.fact, true)
    .addField('Removed At', new Date().toDateString() + ' ' + new Date().toLocaleTimeString(), true);

  await logChannel.send({ embeds: [embed] });
}

module.exports = { scheduleMessages, logFactAdded, logFactRemoved };