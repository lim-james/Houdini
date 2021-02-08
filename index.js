const Discord = require("discord.js");
const config = require("./config.json");

import Time from "./time";

const client = new Discord.Client();
client.login(config.BOT_TOKEN);

var channels;

const onVanish = (channel, value) => {
  if (value == "off") {
    channels[channel.id].duration = 0;
  } else {
    const t = Time.parseDuration(value);
    channels[channel.id].duration = t;
    channel.send(`:cloud_tornado: Messages will disappear after ${t}s.`);
  }
};

const cmdHandler = (message) => {
	const body = message.content.slice(config.PREFIX.length);
  const args = body.split(" ");
  const cmd = args.shift().toLowerCase();

  if (cmd == "vanish") {
		onVanish(message.channel, args.shift().toLowerCase());
  }
};

const vanishHandler = (message) => {

};

client.on("message", (message) => {
  if (message.content.startsWith(config.PREFIX) && !message.author.bot) {
    cmdHandler(message);
  } else if (channels[message.channel.id].duration > 0) {
    vanishHandler(message);
	}
});
