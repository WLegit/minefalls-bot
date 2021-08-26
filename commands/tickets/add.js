const discord = require("discord.js")
const ticketSchema = require("../../schemas/ticket")
module.exports.run = async (client, message, args) => {
    let ticketGuild = await ticketSchema.findOne({
        guildID: message.guild.id
    })

    if(!ticketGuild) return message.channel.send(new discord.MessageEmbed().setColor("RED").setDescription("Doesn't seem like you have setup tickets, set them up before using this command"))

    let supportRole = message.guild.roles.cache.get(ticketGuild.supportRoleID)
    if(!supportRole) return message.channel.send(new discord.MessageEmbed().setColor("RED").setDescription("Doesn't seem like you have setup tickets, set them up before using this command"))

if(!message.member.roles.cache.has(supportRole.id)) return message.channel.send(new discord.MessageEmbed().setColor("RED").setDescription("You do not have the support role to use this command"))

    if(!message.channel.name.startsWith("ticket-")) return message.channel.send(new discord.MessageEmbed().setColor("RED").setDescription("This channel is not a valid ticket, how are you supposed to add someone."))

    let member = message.mentions.members.first() || message.guild.members.cache.get(args[0])
    if(!member) return message.channel.send(new discord.MessageEmbed().setDescription("You did not mention a member to add to the ticket"))

    let pogy = message.guild.me
    let everyone = message.guild.roles.everyone;
    let author = message.author

 message.channel.updateOverwrite(pogy, { VIEW_CHANNEL: true, READ_MESSAGES: true, SEND_MESSAGES: true, READ_MESSAGE_HISTORY: true, ATTACH_FILES: true });

 message.channel.updateOverwrite(everyone, { VIEW_CHANNEL: false });
   
 message.channel.updateOverwrite(author, { VIEW_CHANNEL: true, READ_MESSAGES: true, SEND_MESSAGES: true, READ_MESSAGE_HISTORY: true, ATTACH_FILES: true });
 
 message.channel.updateOverwrite(member.id, { VIEW_CHANNEL: true, READ_MESSAGES: true, SEND_MESSAGES: true, READ_MESSAGE_HISTORY: true, ATTACH_FILES: true });

    message.channel.send(new discord.MessageEmbed().setDescription(`I have sucessfully added ${member} to the ticket`))
}

module.exports.help = {
    name: "add",
    aliases: ["addmember"],
    description: "Add command for adding members to a ticket in your server",
    usage: "<member>",
    category: "Tickets"
}