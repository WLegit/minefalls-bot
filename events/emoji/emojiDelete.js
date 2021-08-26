const discord = require("discord.js")
const config = require("../../config")
const reactionTicket = require("../../schemas/ticket.js")
const moment = require("moment")
module.exports = async (client, emoji) => {
    let log = emoji.guild.channels.cache.find(ch => ch.name === config.modLogChannel)
    if(log) {
        const embed = new discord.MessageEmbed()
        .setColor("BLUE")
        .setTitle("Old Emoji")
        .setDescription(`Deleted custom emoji (${emoji.name})`)
        log.send(embed)
    }
}