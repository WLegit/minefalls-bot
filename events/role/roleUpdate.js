const discord = require("discord.js")
const config = require("../../config")
const moment = require("moment")
module.exports = async (client, oldRole, newRole) => {
    let log = client.channels.cache.find(ch => ch.name === config.modLogChannel)
    if(log) {
        const embed = new discord.MessageEmbed()
        .setColor("BLUE")
        .setTitle("Role Edited")
        .setDescription(`Role edited\nRole Name: ${oldRole.name}\n\n-> ${newRole} (${newRole.name})`)
        log.send(embed)
    } else {
        console.log("NOTHING")
    }
}