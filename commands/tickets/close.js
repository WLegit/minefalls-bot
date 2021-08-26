const discord = require("discord.js")
const hastebin = require("hastebin")
const date = require('date-and-time')
const ticketSchema =require("../../schemas/ticket")

module.exports.run = async (client, message, args) => {
    let ticketData = await ticketSchema.findOne({
        guildID: message.guild.id
    })
    if(!ticketData) return message.channel.send(new discord.MessageEmbed().setColor("RED").setDescription("Doesn't seem like you have setup tickets, set them up before using this command"))
    

    if(!message.channel.name.startsWith("ticket-")) return message.channel.send(new discord.MessageEmbed().setColor("RED").setDescription("This channel is not a valid ticket, how are you supposed to claim it."))

    let reason = args.slice(0).join(" ")
    if(!reason) reason ="No reason given."

    message.channel.messages.fetch()
  .then(messages => {
    let text = "";

  for (let [key, value] of messages) {
        const now = new Date();
      let dateString = `${date.format(now, 'YYYY/MM/DD HH:mm:ss', true)}`;

      text += `${dateString} | ${value.author.tag}: ${value.content}\n`;
  }


 message.channel.delete()
        const logEmbed = new discord.MessageEmbed()

.setColor("GREEN")

.setTitle("Ticket Closed")

.addField("Closed By", message.author.tag)

.addField("Reason", reason)
        


let logs = message.guild.channels.cache.get(ticketData.ticketModlogID)

if(logs) {

logs.send(logEmbed)

}

 

          

        
      })
    
}

module.exports.help = {
    name: "close",
    aliases: [],
    description: "Close command to close tickets in your server",
    usage: " ",
    category: "Tickets"
}