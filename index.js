const Discord = require("discord.js");
const config = require("./config.json");

import Time from './time';

const client = new Discord.Client();
client.login(config.BOT_TOKEN);

client.on("message", message => {
    if (message.author.bot) return;

    if (message.content.startsWith(config.PREFIX)) {
        const body = message.content.slice(config.PREFIX.length);
        const args = body.split(' ');
        const cmd = args.shift().toLowerCase();

        if (cmd == "vanish") {
            const value = args.shift().toLowerCase();
            if (value == "off") {

            } else {
                const t = Time.parseDuration(value);
                message.channel.send(`:cloud_tornado: Messages will disappear after ${t}s. ${message.createdTimestamp}`);
            }
        }
    }
});
