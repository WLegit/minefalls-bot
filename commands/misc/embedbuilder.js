const discord =  require("discord.js")
const config = require("../../config")
module.exports.run =  async (client, message, args) => {
    if(!message.member.hasPermission('MANAGE_MESSAGES')) return message.channel.send(`You do not have permission to run this command`)
    let channel = message.mentions.channels.first()
    if(!channel) return message.channel.send(new discord.MessageEmbed().setColor("RED").setDescription(`Invalid use of command. Usage: ${config.prefix}embedbuilder <channel> HexColor|Title|Description|Footer`))

    let phrase = args.slice(1).join(" ")
    let splitted = phrase.split("|")
    let color = splitted[0]
    let title = splitted[1]
    let description = splitted[2]
    let footer = splitted [3]

    let embed = new discord.MessageEmbed()
    .setColor(color)
    .setTitle(title)
    .setDescription(description)
    .setFooter(footer)

    await channel.send(embed).catch(err => { 
        return message.channel.send(new discord.MessageEmbed().setColor("RED").setDescription("There was an error sending the message. Error: " + err))
    })

    if(channel === message.channel) {
        return message.delete()
    } else {
    message.channel.send(new discord.MessageEmbed().setColor("GREEN").setDescription("The embed has been sent in " + `${channel}`))
    }
}

module.exports.help = {
    name: "embedbuilder",
    aliases: ["eb"],
    description: "Embed builder command for creating custom embeds in your server",
    usage: "<channel> HexColor|Title|Description|Footer",
    category: "misc"
}