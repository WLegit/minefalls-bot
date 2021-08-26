const discord = require("discord.js")
const config = require("../../config")
const reactionTicket = require("../../schemas/ticket.js")
const moment = require("moment")
module.exports = async (client, oldEmoji, newEmoji) => {
    let log = newEmoji.guild.channels.cache.find(ch => ch.name === config.modLogChannel)
    if(log) {
        const embed = new discord.MessageEmbed()
        .setColor("BLUE")
        .setTitle("Edited Emoji")
        .setDescription(`Edited custom emoji ${oldEmoji.name} -> ${newEmoji.name}`)
        log.send(embed)
    }
}