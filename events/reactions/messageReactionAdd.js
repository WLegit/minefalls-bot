const discord = require("discord.js")
const config = require("../../config")
const reactionTicket = require("../../schemas/ticket.js")
const suggestion = require("../../schemas/suggestion.js")
const moment = require("moment")
module.exports = async (client, messageReaction, user) => {
        const { message, emoji } = messageReaction
        if(client.user === user) return
        const member = message.guild.members.cache.get(user.id);
		await reactionTicket.findOne({
            guildID: message.guild.id,
            messageID: message.id,
            ticketReaction: emoji.toString()
          }, async(err, db) => {
      
      
            if(!db) return;
            if(message.id != db.messageID) return; 
            
  
 
            
            if(emoji.toString() === db.ticketReaction || emoji.name === db.ticketReaction ) {

                
              let serverCase = db.ticketCase;
      if(!serverCase || serverCase === null) serverCase = '1';
      
            let channelReact = message.guild.channels.cache.get(db.ticketReactChannel)
            let ticketRole = message.guild.roles.cache.get(db.supportRoleID);
            let ticketCategory = message.guild.channels.cache.get(db.categoryID)
            let ticketLog = message.guild.channels.cache.get(db.ticketModlogID)
            let staff = message.guild.roles.cache.get('768475975880933407')
            
     message.reactions.cache.find(r => r.emoji.name == emoji.name).users.remove(user.id).catch(()=>{})
      
            let id = user.id.toString().substr(0, 4) + user.discriminator;
            let chann = `ticket-${id}`;
      
      
            let array = []
      
              message.guild.channels.cache.forEach(channel => {
       if(channel.name == chann) array.push(channel.id)
              })
             
      
      let ticketlimit = db.maxTicket
      if(!ticketlimit) ticketlimit = 1
      
      let arraylength = array.length
      
      
            if(arraylength > ticketlimit || arraylength == ticketlimit) {
              
              return user.send(new discord.MessageEmbed().setColor("RED").setDescription(`You already have ${arraylength} open tickets, as the current guild's ticket limit is ${ticketlimit} `).setAuthor(user.tag, user.displayAvatarURL()) )
      
      
            }
      
      
      let pogy = message.guild.me;
      
      let everyone = message.guild.roles.everyone;
      
      
      

      message.guild.channels.create(chann, { permissionOverwrites:[
           {
            allow:  ['VIEW_CHANNEL', 'SEND_MESSAGES', 'ATTACH_FILES', 'READ_MESSAGE_HISTORY', 'ADD_REACTIONS', 'MANAGE_CHANNELS'],
            id: message.guild.me
          },
	      
          {
            allow:  ['VIEW_CHANNEL', 'SEND_MESSAGES', 'ATTACH_FILES', 'READ_MESSAGE_HISTORY', 'ADD_REACTIONS'],
            id: user
          },
          {
            allow:  ['VIEW_CHANNEL', 'SEND_MESSAGES', 'ATTACH_FILES', 'READ_MESSAGE_HISTORY', 'ADD_REACTIONS'],
            id: ticketRole
          },
          {
            allow:  ['VIEW_CHANNEL', 'SEND_MESSAGES', 'ATTACH_FILES', 'READ_MESSAGE_HISTORY', 'ADD_REACTIONS'],
            id: staff
          },
		 {
            deny: [ 'VIEW_CHANNEL','SEND_MESSAGES'],
            id: message.guild.roles.everyone
          },
        ],
        parent: ticketCategory.id,
        reason: `Ticket Module`,
        topic: `**ID:** ${user.id} | **Tag:** ${user.tag}`
      }).then(async(chan)=>{
          
          await chan.updateOverwrite(user, { VIEW_CHANNEL: true, READ_MESSAGES: true, SEND_MESSAGES: true, READ_MESSAGE_HISTORY: true, ATTACH_FILES: true });
           
          await db.updateOne({ticketCase: serverCase + 1});
      
      
             let color = db.ticketWelcomeColor
          if(color == "#000000") color = message.guild.me.displayHexColor
      
          if(db.ticketPing == "true"){
      
          
          chan.send(`${member} <@&${db.supportRoleID}>`);
       


          }
            chan.send("<@&765852967190396930>" + ` ${user}` ,new discord.MessageEmbed()
          .setAuthor(user.tag, user.displayAvatarURL())
      
          .setDescription(db.ticketWelcomeMessage
              .replace(/{user}/g, `${member}`)
              .replace(/{user_tag}/g, `${member.tag}`)
              .replace(/{user_name}/g, `${member.username}`)
              .replace(/{reason}/g, `${member.username}`)
              .replace(/{user_ID}/g, `${member.id}`))
              
          .setColor(color)
          )
      

        await chan.updateOverwrite(user, { VIEW_CHANNEL: true, READ_MESSAGES: true, SEND_MESSAGES: true, READ_MESSAGE_HISTORY: true, ATTACH_FILES: true });
      
      let color2 = db.ticketLogColor
          if(color2 == "#000000") color2 = `#36393f`;
      
          const embedLog = new discord.MessageEmbed()
            .setColor(color2)
            .setTitle("Ticket Created")
            .setTimestamp()
            .addField("Information" , `**User:** ${user}\n**Ticket Channel: **${chan.name}\n**Ticket:** #${serverCase}\n**Date:** ${moment(new Date()).format("dddd, MMMM Do YYYY")} `)
            if(ticketLog) {
          ticketLog.send(chann, embedLog, {
         name: `Ticket Logs`,
         icon: `https://i.imgur.com/FhSe3Kl.png`
      }).catch(()=>{})            
    }
      }).catch((err) => {
        console.log(err)
        message.channel.send(new discord.MessageEmbed().setColor("RED").setDescription("There was an error creating the ticket, please check my permissions or contact support.")).then(m => m.delete({timeout: 5000})).catch(() => {})
      })
    };
  })
    
    if(message.channel.id === "856596510942035978") {
        let findSuggestion = await suggestion.findOne({
            suggestionID: message.id
        })
        if(findSuggestion) {
            if(findSuggestion.userWhoSuggestedID === user.id) {
                message.reactions.cache.find(r => r.emoji.name == emoji.name).users.remove(user.id).catch(()=>{})
                return user.send(new discord.MessageEmbed().setColor("RED").setDescription("You cannot react to your own suggestion"))
            }
        }
    }
    
};