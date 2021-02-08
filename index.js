const Discord = require("discord.js");
const config = require("./config.json");

const client = new Discord.Client();
client.login(config.BOT_TOKEN);

var channels = {};
var queue = [];
var process;

const parseDuration = (value) => {
  return Number.parseInt(value);
};

const vanish = (item, duration) => {
  process = setTimeout(() => {
    item.message.delete();

    queue.shift();
    const next = queue[0];
    if (next !== undefined) {
      vanish(next, next.t - new Date().getTime());
    }
  }, duration);
};

const queueVanish = (message, duration) => {
  const t = new Date(message.createdTimestamp);
  t.setSeconds(t.getSeconds() + duration);
	
	const obj = { message, t };

  if (queue.length == 0) {
    queue.push(obj);
    vanish(queue[0], duration * 1000);
  } else {
    var i = 0;
    while (i < queue.length && queue[i].t < t) {
      ++i;
    }

		if (i == 0) {
			clearTimeout(process);
			queue.unshift(obj);
			vanish(queue[0], duration * 1000);
		} else if (i == queue.length) {
      queue.push(obj);
    } else {
      queue.slice(i, 0, obj);
    }
  }
};

const onVanish = (channel, value) => {
  const id = channel.id;
  if (value == "off") {
    if (id in channels && channels[id] > 0) {
      channels[id] = 0;
      channel.send(`:cloud_tornado: Vanishing is off.`).then(
				(message) => queueVanish(message, config.CMD_LIFETIME)
			);
    }
  } else {
    const t = parseDuration(value);
    channels[id] = t;
    channel.send(`:cloud_tornado: Messages will disappear after **${t}**s.`).then(
			(message) => queueVanish(message, config.CMD_LIFETIME)
		);
  }
};

const cmdHandler = (message) => {
  const body = message.content.slice(config.PREFIX.length);
  const args = body.split(" ");
  const cmd = args.shift().toLowerCase();

  if (cmd == "vanish") {
    onVanish(message.channel, args.shift().toLowerCase());
		queueVanish(message, config.CMD_LIFETIME);
  }
};

const vanishHandler = (message) => {
  const id = message.channel.id;
  queueVanish(message, channels[id]);
};

client.on("message", (message) => {
  if (message.author.id == client.user.id) return;

  if (message.content.startsWith(config.PREFIX) && !message.author.bot) {
    cmdHandler(message);
  } else if (
    message.channel.id in channels &&
    channels[message.channel.id] > 0
  ) {
    vanishHandler(message);
  }
});
