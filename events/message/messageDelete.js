const discord = require("discord.js")
const config = require("../../config")
const reactionTicket = require("../../schemas/ticket.js")
const moment = require("moment")
module.exports = async (client, message) => {
    let log = message.guild.channels.cache.find(ch => ch.name === config.modLogChannel)
    if(log) {
        const embed = new discord.MessageEmbed()
        .setColor("BLUE")
        .setTitle("Message Deleted " + `| ${message.author.tag}`)
        .setDescription(`Message deleted by ${message.author} in ${message.channel}\n-> ${message.content}`)
        log.send(embed).catch(() => {})
    }
}