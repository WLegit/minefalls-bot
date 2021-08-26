const discord = require("discord.js")
const config = require("../../config")
const moment = require("moment")
module.exports = async (client, oldMessage, newMessage) => {
    if(!newMessage) return;
    
    let log = client.channels.cache.find(ch => ch.name === config.modLogChannel)
    if(log) {
        const embed = new discord.MessageEmbed()
        .setColor("BLUE")
        .setTitle("Message Edited " + `| ${oldMessage.author.tag}`)
        .setDescription(`Message edited by ${oldMessage.author} in ${oldMessage.channel}\n** ** ** **${oldMessage.content}\n\n-> ${newMessage.content}`)
        log.send(embed).catch(() => {})
    }
}