require('dotenv').config();

const { Client, Intents } = require('discord.js');

const client = new Client({
  intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MEMBERS]
});
const PREFIX = '$';

client.on('ready', () => {
  console.log(`${client.user.tag} has logged in`);
});

client.on('messageCreate', async (message) => {
  if (message.author.bot) return;
  if (message.content.startsWith(PREFIX)) {
    const [CMD_NAME, ...args] = message.content.trim().substring(PREFIX.length).split(/\s+/);
    if (CMD_NAME === 'kick') {
      if (!message.member.roles.cache.some((role) => role.name === 'KICK_MEMBERS'))
        return message.reply('You do not have the required role permission');
      if (args.length === 0) return message.reply('please provide an ID');
      const member = message.guild.members.cache.get(args[0]);
      if (member) {
        member
          .kick()
          .then((kickedMember) => message.channel.send(`${kickedMember} has been kicked from the server`))
          .catch(() => message.channel.send('I do not have permissions to kick user :('));
      } else {
        message.channel.send('Member was not found');
      }
    } else if (CMD_NAME === 'ban') {
      if (!message.member.roles.cache.some((role) => role.name === 'BAN_MEMBERS'))
        return message.reply('You do not have the required role permission');
      if (args.length === 0) return message.reply('please provide an ID');
      try {
        const user = await message.guild.members.ban(args[0]);
        message.channel.send('User was banned successfuly');
      } catch (err) {
        message.channel.send('An error occured. Either I do not have permissions or the user was not found');
      }
    }
  }
});

client.login(process.env.DISCORDJS_BOT_TOKEN);
