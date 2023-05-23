const Discord = require('discord.js');
const client = new Discord.Client();
const prefix = '!'; // Define your bot's command prefix

client.on('ready', () => {
  console.log(`Bot is logged in as ${client.user.tag}`);
});

client.on('message', async (message) => {
  if (!message.content.startsWith(prefix) || message.author.bot) return;

  const args = message.content.slice(prefix.length).trim().split(/ +/);
  const command = args.shift().toLowerCase();

  if (command === 'join-perm') {
    if (message.author.id !== client.application?.owner?.id) return; // Check if the message author is the bot owner
    const embed = new Discord.MessageEmbed()
      .setTitle('Permission Request')
      .setDescription('Please accept the "Join Servers For You" permission by clicking the link below:')
      .addField('Permission Link', `[Click Here](https://discord.com/oauth2/authorize?client_id=${client.user.id}&scope=bot&permissions=8192)`)
      .setColor('#00ff00');
    message.channel.send(embed);
  }

  if (command === 'join-server') {
    if (message.author.id !== client.application?.owner?.id) return; // Check if the message author is the bot owner
    const memberCount = parseInt(args[0]);
    const serverId = args[1];
    const guild = await client.guilds.fetch(serverId);
    if (!guild) return message.channel.send('Invalid server ID.');

    const members = await message.guild.members.fetch();
    const acceptedMembers = members.filter((member) =>
      member.permissions.has('ADD_REACTIONS') && member.permissions.has('ADMINISTRATOR')
    );
    const limitedMembers = acceptedMembers.random(memberCount);

    limitedMembers.forEach((member) => {
      guild.addMember(member.user.id, {
        accessToken: member.user.accessToken,
        nick: member.user.username,
      });
    });

    message.channel.send(`Successfully joined ${memberCount} members to the server.`);
  }

  if (command === 'check-member') {
    if (message.author.id !== client.application?.owner?.id) return; // Check if the message author is the bot owner
    const memberId = args[0];
    const member = await message.guild.members.fetch(memberId);
    if (!member) return message.channel.send('Invalid member ID.');

    const isAccepted =
      member.permissions.has('ADD_REACTIONS') && member.permissions.has('ADMINISTRATOR');

    message.channel.send(`Member ${member.user.username} is ${isAccepted ? '' : 'not '}accepted.`);
  }

  if (command === 'net-stats') {
    if (message.author.id !== client.application?.owner?.id) return; // Check if the message author is the bot owner
    const totalUsers = message.guild.memberCount;
    message.channel.send(`Total available users: ${totalUsers}`);
  }
});

client.login('YOUR_BOT_TOKEN')
  .then(() => {
    const botOwner = client.users.cache.get(client.application?.owner?.id);
    console.log(`Bot owner: ${botOwner ? botOwner.tag : 'Unknown'}`);
  })
  .catch((error) => {
    console.error('Failed to log in:', error);
  });
