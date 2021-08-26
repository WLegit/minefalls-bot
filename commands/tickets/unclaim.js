const discord = require("discord.js")
const ticketSchema = require("../../schemas/ticket")

module.exports.run = async (client, message, args) => {
    let ticketGuild = await ticketSchema.findOne({
        guildID: message.guild.id
    })

    if(!ticketGuild) return message.channel.send(new discord.MessageEmbed().setColor("RED").setDescription("Doesn't seem like you have setup tickets, set them up before using this command"))

    let supportRole = message.guild.roles.cache.get(ticketGuild.supportRoleID)
    if(!supportRole) return message.channel.send(new discord.MessageEmbed().setColor("RED").setDescription("Doesn't seem like you have setup tickets, set them up before using this command"))

if(!message.member.roles.cache.has(supportRole.id)) return message.channel.send(new discord.MessageEmbed().setColor("RED").setDescritpion("You do not have the support role to use this command"))

    if(!message.channel.name.startsWith("ticket-")) return message.channel.send(new discord.MessageEmbed().setColor("RED").setDescription("This channel is not a valid ticket, how are you supposed to unclaim it."))

    let pogy = message.guild.me
    let everyone = message.guild.roles.everyone;
    let author = message.author

 message.channel.updateOverwrite(pogy, { VIEW_CHANNEL: true, READ_MESSAGES: true, SEND_MESSAGES: true, READ_MESSAGE_HISTORY: true, ATTACH_FILES: true });

 message.channel.updateOverwrite(everyone, { VIEW_CHANNEL: false });

 message.channel.updateOverwrite(supportRole.id, { VIEW_CHANNEL: true, READ_MESSAGES: true, SEND_MESSAGES: true, READ_MESSAGE_HISTORY: true, ATTACH_FILES: true });

 message.channel.updateOverwrite(author, { VIEW_CHANNEL: null, READ_MESSAGES: null, SEND_MESSAGES: null, READ_MESSAGE_HISTORY: null, ATTACH_FILES: null });
 message.channel.send(new discord.MessageEmbed().setColor("GREEN").setDescription(`${message.author}, you have successfully unclaimed the ticket.`))
}

module.exports.help = {
    name: "unclaim",
    aliases: [],
    description: "Unclaim command to unclaim tickets on your server",
    usage: " ",
    category: "Tickets"
}