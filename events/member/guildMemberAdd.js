const discord = require("discord.js")
const config = require("../../config")
const reactionTicket = require("../../schemas/ticket.js")
const moment = require("moment")
module.exports = async (client, member) => {
    let log = member.guild.channels.cache.find(ch => ch.name === config.modLogChannel)
    if(log) {
        const embed = new discord.MessageEmbed()
        .setColor("BLUE")
        .setTitle("New Member")
        .setDescription(`Member Joined\n-> ${member}`)
        log.send(embed)
    }
}