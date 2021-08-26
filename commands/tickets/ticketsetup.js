const discord = require("discord.js")
const config = require("../../config")
const ticketSchema = require("../../schemas/ticket.js")

module.exports.run = async (client, message, args) => {
    if(!message.member.hasPermission("ADMINISTRATOR")) return message.channel.send(new discord.MessageEmbed().setColor("RED").setDescription(`${message.author.tag}, you do not have the administratotr permission`))
    
    let filter = m => m.author.id === message.author.id;

    message.channel.send(new discord.MessageEmbed().setColor("GREEN").setDescription("__**Please Choose Between:**__\n\n`reaction`\nSetup tickets with a reaction"))
    .then(() => {
      message.channel.awaitMessages(filter, { max: 1, time: 60000, errors: ["time"]})
      .then(collected => {
        let choice = collected.first().content
        let toChooseFrom = ["reaction"] //, message
        if(choice.toLowerCase() === 'cancel') return message.channel.send(new discord.MessageEmbed().setColor("RED").setDescription("Succesfully Cancelled Prompt")) 
        if(!toChooseFrom.includes(choice.toLowerCase())){
        message.channel.send(new discord.MessageEmbed().setColor("RED").setDescription("Invalid Choice\n\n__**Available Choices:**__ {toChooseFrom}".replace("{toChooseFrom}", toChooseFrom.join(", "))))
    return;

        }
        
        //Reaction ticket
        if(choice.toLowerCase() === "reaction") {
          message.channel.send(new discord.MessageEmbed().setColor("GREEN").setTitle("Reaction").setDescription("Please Provide me with the **channel** you would like people to react in!\n**<channel / id>**\n\n**Type Cancel to Cancel**"))
          .then(() => {
           message.channel.awaitMessages(filter, { max: 1, time: 60000, errors: ["time"]})
           .then(collected2 => {
             let channel = collected2.first().content
             let channelMention = collected2.first().mentions
             let channelToSend = channelMention.channels.first() || message.guild.channels.cache.get(channel) || message.guild.channels.cache.find(ch => ch.name === channel.toLowerCase())
             if (channel.toLowerCase() === 'cancel') return message.channel.send(new discord.MessageEmbed().setColor("RED").setTitle("Reaction").setDescription("Succesfully Cancelled Prompt"))
             if(!channelToSend) return message.channel.send(new discord.MessageEmbed().setColor("RED").setTitle("Reaction").setDescription("Please Provide me with the **channel** you would like people to react in!\n**<channel / id>**\n\n**Type Cancel to Cancel**")) 
             
             message.channel.send(new discord.MessageEmbed().setTitle("Reaction").setDescription("__**Please Pick**__\n\n`bot`\nPeople will react to the bot's default reaction Embed\n\n`Custom`\nPeople will react to a provided message of your choice (message ID)").setColor("GREEN"))
             .then(() => {
              message.channel.awaitMessages(filter, { max: 1, time: 60000, errors: ["time"]})
              .then(collected3 => {
                let choice = collected3.first().content
                let choices = ["custom", "bot"]
                if(!choices.includes(choice.toLowerCase())) return message.channel.send(new discord.MessageEmbed().setColor("RED").setTitle("Reaction").setDescription("Invalid Choice\n\n__**Available Choices:**__ {toChooseFrom}".replace("{toChooseFrom}", toChooseFrom.join(", ")))) 
                
                //custom message from user
                if(choice.toLowerCase() === "custom") {
                  
                  message.channel.send(new discord.MessageEmbed().setColor("GREEN").setTitle("Reaction").setDescription("Please Provide me with a **message ID** from the channel you provided earlier.\n\n**Type Cancel to Cancel**"))
                  .then(() => {
                   message.channel.awaitMessages(filter, { max: 1, time: 60000, errors: ["time"]})
                   .then(async collected4 => {
                     
                    let ID = collected4.first().content
                    if (ID.toLowerCase() === 'cancel') return message.channel.send(new discord.MessageEmbed().setColor("RED").setTitle("Reaction").setDescription("Succesfully Cancelled Prompt"))

                    let messageID = await channelToSend.messages.fetch(ID).catch(() => { return message.channel.send(new discord.MessageEmbed().setColor("RED").setDescription("Could not reach the following Message ID, prompt cancelled!"));
                   })
                    
                    message.channel.send(new discord.MessageEmbed().setColor("GREEN").setTitle("Reaction").setDescription("Please provide me with a category where all tickets will be stored\n**[category ID / Name]**\n\n**Type Cancel to cancel**"))
                    .then(() => {
                     message.channel.awaitMessages(filter, { max: 1, time: 60000, errors: ["time"]})
                     .then(collected5 => {
                       let categoryChannelName = collected5.first().content
                       let categoryChannel = message.guild.channels.cache.find(ch => ch.name.toLowerCase().includes(categoryChannelName.toLowerCase())) || message.guild.channels.cache.get(categoryChannelName)

                        if (categoryChannelName.toLowerCase() === 'cancel') return message.channel.send(new discord.MessageEmbed().setColor("RED").setTitle("Reaction").setDescription("Succesfully Cancelled Prompt"))
                        
                       if(!categoryChannel) return message.channel.send(new discord.MessageEmbed().setColor("RED").setDescription("The category provided is invalid, prompt cancelled!")) 

                       if(categoryChannel.type !== "category") return message.channel.send(new discord.MessageEmbed().setColor("RED").setDescription("The channel provided is not a category!"))
                       message.channel.send(new discord.MessageEmbed().setColor("GREEN").setTitle("Reaction").setDescription("Please provide me with a support Role that will have access to all tickets\n\n**Type Cancel to cancel**"))
                       .then(() => {
                        message.channel.awaitMessages(filter, { max: 1, time: 60000, errors: ["time"]})
                        .then(collected6 => {
                          let roleName = collected6.first().content
                          let roleMention = collected6.first().mentions
                          let role = message.guild.roles.cache.get(roleName) || message.guild.roles.cache.find(rl => rl.name.toLowerCase().includes(roleName.toLowerCase())) || roleMention.roles.first()

                           if (roleName.toLowerCase() === 'cancel') return message.channel.send(new discord.MessageEmbed().setColor("RED").setTitle("Reaction").setDescription("Succesfully Cancelled Prompt"))

                          if(!role) return message.channel.send(new discord.MessageEmbed().setColor("RED").setDescription("Invalid Role Provided, prompt Cancelled!")) 
                        message.channel.send(new discord.MessageEmbed().setColor("GREEN").setTitle("Reaction").setDescription("Lastly, please provide me with a ticket log where all logs will log there!\n\n**Type Cancel to cancel**")).then(() => {
                             message.channel.awaitMessages(filter, { max: 1, time: 60000, errors: ["time"]})
                             .then(collected7 => {
                    let modlog = collected7.first().content
                    let modlogMention = collected7.first().mentions
                    let modlogChannel = modlogMention.channels.first() || message.guild.channels.cache.get(modlog) || message.guild.channels.cache.find(ch => ch.name === modlog.toLowerCase())
                     if (modlog.toLowerCase() === 'cancel') return message.channel.send(new discord.MessageEmbed().setColor("RED").setTitle("Reaction").setDescription("Succesfully Cancelled Prompt"))

             if(!modlogChannel) return message.channel.send(new discord.MessageEmbed().setColor("RED").setTitle("Reaction").setDescription("Please Provide me with the **channel** you would like people to react in!\n**<channel / id>**\n\n**Type Cancel to Cancel**")) 
             
             
             
             
             message.channel.send(new discord.MessageEmbed().setColor("GREEN").setTitle("Reaction").setDescription("Successfully created the ticket system!\n\n**Option:**{option}".replace("{option}", choice.toLowerCase())))
                .then(async () => {
                  messageID.react("🎫");
                  await ticketSchema.findOne({
                    guildID: message.guild.id
                }, async (err, guild) => {
                  if(!guild){
                  const newGuild = await ticketSchema.create({
                    guildID: message.guild.id,
                    ticketReactChannel: channelToSend.id,
                    supportRoleID: role.id,
                    messageID: ID,
                    categoryID: categoryChannel.id,
                    ticketModlogID: modlogChannel.id,
                    ticketCustom: "true",
                    ticketType: "reaction",
                    ticketToggle: "true"
                    });
                    newGuild.save()
                    return;
                  }
                  let newTicketSchema =  await ticketSchema.findOne({
                    guildID: message.guild.id
                })
                           new ticketSchema({
                            guildID: message.guild.id,
                            ticketReactChannel: channelToSend.id,
                            messageID: ID,
                            supportRoleID: role.id,
                            categoryID: categoryChannel.id,
                            ticketModlogID: modlogChannel.id,
                            ticketType: "reaction",
                            ticketCustom: "true",
                            ticketToggle: "true"
                            }).save()
                
                });

                  })
                         }).catch(err => { 
         
                           message.channel.send(new discord.MessageEmbed().setColor("RED").setDescription("The time has ended, prompt ended"));

                       
                         })
                         
                        })
                       }).catch(err => {
                       
                       message.channel.send(new discord.MessageEmbed().setColor("RED").setDescription("The time has ended, prompt ended")); })
                     })

                     }).catch(err => { message.channel.send(new discord.MessageEmbed().setColor("RED").setDescription("The time has ended, prompt ended")); 

                     })
                    })
                   }).catch(err => { message.channel.send(new discord.MessageEmbed().setColor("RED").setDescription("The time has ended, prompt ended")); 
                   })
                  }) 
                }
                
                //message from bot
              if(choice.toLowerCase() === "bot") {
                    
                    message.channel.send(new discord.MessageEmbed().setColor("GREEN").setTitle("Reaction").setDescription("Please provide me with a category where all tickets will be stored\n**[category ID / Name]**\n\n**Type Cancel to cancel**"))
                    .then(() => {
                     message.channel.awaitMessages(filter, { max: 1, time: 60000, errors: ["time"]})
                     .then(collected5 => {
                       let categoryChannelName = collected5.first().content
                       let categoryChannel = message.guild.channels.cache.find(ch => ch.name.toLowerCase().includes(categoryChannelName.toLowerCase())) || message.guild.channels.cache.get(categoryChannelName)

                        if (categoryChannelName.toLowerCase() === 'cancel') return message.channel.send(new discord.MessageEmbed().setColor("RED").setTitle("Reaction").setDescription("Succesfully Cancelled Prompt"))
                       if(!categoryChannel) return message.channel.send(new discord.MessageEmbed().setColor("RED").setDescription("The category provided is invalid, prompt cancelled!")) 
                       if(categoryChannel.type !== "category") return message.channel.send(new discord.MessageEmbed().setColor("RED").setDescription("The channel provided is not a category!"))
                       message.channel.send(new discord.MessageEmbed().setColor("GREEN").setTitle("Reaction").setDescription("Please provide me with a support Role that will have access to all tickets\n\n**Type Cancel to cancel**"))
                       .then(() => {
                        message.channel.awaitMessages(filter, { max: 1, time: 60000, errors: ["time"]})
                        .then(collected6 => {
                          let roleName = collected6.first().content
                          let roleMention = collected6.first().mentions
                          let role = message.guild.roles.cache.get(roleName) || message.guild.roles.cache.find(rl => rl.name.toLowerCase().includes(roleName.toLowerCase())) || roleMention.roles.first()

                           if (roleName.toLowerCase() === 'cancel') return message.channel.send(new discord.MessageEmbed().setColor("RED").setTitle("Reaction").setDescription("Succesfully Cancelled Prompt"))

                          if(!role) return message.channel.send(new discord.MessageEmbed().setColor("RED").setDescription("Invalid Role Provided, prompt Cancelled!")) 
                        
                        message.channel.send(new discord.MessageEmbed().setColor("GREEN").setTitle("Reaction").setDescription("Lastly, please provide me with a ticket log where all logs will log there!\n\n**Type Cancel to cancel**"))
                        .then(() => {
                         message.channel.awaitMessages(filter, { max: 1, time: 60000, errors: ["time"]})
                          .then(collected7 => {
                    let modlog = collected7.first().content
                    let modlogMention = collected7.first().mentions
                    let modlogChannel = modlogMention.channels.first() || message.guild.channels.cache.get(modlog) || message.guild.channels.cache.find(ch => ch.name === modlog.toLowerCase())

                     if (modlog.toLowerCase() === 'cancel') return message.channel.send(new discord.MessageEmbed().setColor("RED").setTitle("Reaction").setDescription("Succesfully Cancelled Prompt"))

             if(!modlogChannel) return message.channel.send(new discord.MessageEmbed().setColor("RED").setTitle("Reaction").setDescription("Please Provide me with the **channel** you would like people to react in!\n**<channel / id>**\n\n**Type Cancel to Cancel**"))
           
             message.channel.send(new discord.MessageEmbed().setColor("GREEN").setTitle("Reaction").setDescription("Successfully created the ticket system!\n\n**Option:**{option}".replace("{option}", choice.toLowerCase())))
                .then(async () => {
                  let m = await channelToSend.send(new discord.MessageEmbed().setColor("GREEN").setTitle("Server Tickets").setDescription("Please react with 🎫 to open a ticket!"))
                   m.react("🎫");

                   await ticketSchema.findOne({
                    guildID: message.guild.id
                }, async (err, guild) => {
                  if(!guild){
                  const newGuild = new ticketSchema({
                    guildID: message.guild.id,
                    ticketReactChannel: channelToSend.id,
                    supportRoleID: role.id,
                    categoryID: categoryChannel.id,
                    ticketModlogID: modlogChannel.id,
                    ticketType: "reaction",
                    ticketCustom: "false",
                    ticketToggle: "true",
                    messageID: m.id
                    })
                    newGuild.save()
                    return;
                  }
                  let newTicketSchema =  await ticketSchema.findOne({
                    guildID: message.guild.id
                })
                           new ticketSchema({
                            guildID: message.guild.id,
                            ticketReactChannel: channelToSend.id,
                            messageID: m.id,
                            supportRoleID: role.id,
                            categoryID: categoryChannel.id,
                            ticketModlogID: modlogChannel.id,
                            ticketType: "reaction",
                            ticketCustom: "false",
                             ticketToggle: "true"
                            }).save()
                
                });

                  })
                         }).catch(err => { message.channel.send(new discord.MessageEmbed().setColor("RED").setDescription("The time has ended, prompt ended")); 
      })
                        })
                       }).catch(err => { message.channel.send(new discord.MessageEmbed().setColor("RED").setDescription("The time has ended, prompt ended")); 
                      })
                     })

                     }).catch(err => { message.channel.send(new discord.MessageEmbed().setColor("RED").setDescription("The time has ended, prompt ended")); 
          })
                    })
                }
                
              }).catch(err => { message.channel.send(new discord.MessageEmbed().setColor("RED").setDescription("The time has ended, prompt ended")); 
        })
             })
           }).catch(err => { message.channel.send(new discord.MessageEmbed().setColor("RED").setDescription("The time has ended, prompt ended"))
          
})
          })
        }
        
        /*if(choice.toLowerCase() === "message") {
          //return message.channel.send(new discord.MessageEmbed().setColor("GREEN").setTitle(language.ticketsetupMessage).setDescription("Coming soon")).then(m => m.delete({timeout: 5000}))
          message.channel.send(new discord.MessageEmbed().setColor("GREEN").setTitle(language.ticketsetupMessage).setDescription("Please provide me with a category where all tickets will be stored\n**[category ID / Name]**\n\n**Type Cancel to cancel**"))
                  .then(() => {
          message.channel.awaitMessages(filter, { max: 1, time: 60000, errors: ["time"]})
           .then(async collected5 => {
            let categoryChannelName = collected5.first().content
            let categoryChannel = message.guild.channels.cache.find(ch => ch.name.toLowerCase().includes(categoryChannelName.toLowerCase())) || message.guild.channels.cache.get(categoryChannelName)
             if (categoryChannelName.toLowerCase() === 'cancel') return message.channel.send(new discord.MessageEmbed().setColor("RED").setTitle("Reaction").setDescription("Succesfully Cancelled Prompt"))

            if(!categoryChannel) return message.channel.send(new discord.MessageEmbed().setColor("RED").setDescription("The category provided is invalid, prompt cancelled!")) 
            if(categoryChannel.type !== "category") return message.channel.send(new discord.MessageEmbed().setColor("RED").setDescription("The channel provided is not a category!"))
            message.channel.send(new discord.MessageEmbed().setColor("GREEN").setTitle(language.ticketsetupMessage).setDescription(language.ticketsetupReactionCustomRole))
            .then(() => {
              message.channel.awaitMessages(filter, { max: 1, time: 60000, errors: ["time"]})
              .then(collected6 => {
                let roleName = collected6.first().content
                let roleMention = collected6.first().mentions
                let role = message.guild.roles.cache.get(roleName) || message.guild.roles.cache.find(rl => rl.name.toLowerCase().includes(roleName.toLowerCase())) || roleMention.roles.first()
                 if (roleName.toLowerCase() === 'cancel') return message.channel.send(new discord.MessageEmbed().setColor("RED").setTitle("Reaction").setDescription("Succesfully Cancelled Prompt"))
                if(!role) return message.channel.send(new discord.MessageEmbed().setColor("RED").setDescription("Invalid Role Provided, prompt Cancelled!"))
                        
                message.channel.send(new discord.MessageEmbed().setColor("GREEN").setTitle(language.ticketsetupMessage).setDescription("Lastly, please provide me with a ticket log where all logs will log there!\n\n**Type Cancel to cancel**"))
                .then(() => {
                 message.channel.awaitMessages(filter, { max: 1, time: 60000, errors: ["time"]})
                 .then(collected7 => {
                    let modlog = collected7.first().content
                    let modlogMention = collected7.first().mentions
                    let modlogChannel = modlogMention.channels.first() || message.guild.channels.cache.get(modlog) || message.guild.channels.cache.find(ch => ch.name === modlog.toLowerCase())

                     if (modlog.toLowerCase() === 'cancel') return message.channel.send(new discord.MessageEmbed().setColor("RED").setTitle("Reaction").setDescription("Succesfully Cancelled Prompt"))
             if(!modlogChannel) return message.channel.send(new discord.MessageEmbed().setColor("RED").setTitle(language.ticketsetupMessage).setDescription("Please Provide me with the **channel** you would like people to react in!\n**<channel / id>**\n\n**Type Cancel to Cancel**")) 
             
             message.channel.send(new discord.MessageEmbed().setColor("GREEN").setTitle("Reaction").setDescription("Successfully created the ticket system!\n\n**Option:**{option}".replace("{option}", choice.toLowerCase())))
             .then(async () => {
              await ticketSchema.findOne({
                    guildID: message.guild.id
                }, async (err, guild) => {
                  if(!guild){
                  const newGuild = await ticketSchema.create({
                    guildID: message.guild.id,
                    ticketReactChannel: null,
                    messageID: null,
                    supportRoleID: role.id,
                    categoryID: categoryChannel.id,
                    ticketModlogID: modlogChannel.id,
                    ticketType: "message"
                    });
                    newGuild.save()
                    return;
                  }
                  let newTicketSchema =  await ticketSchema.findOne({
                    guildID: message.guild.id
                })


                await ticketSchema.updateOne({
                    guildID: message.guild.id,
                    ticketReactChannel: null,
                    messageID: null,
                    supportRoleID: role.id,
                    categoryID: categoryChannel.id,
                    ticketModlogID: modlogChannel.id,
                    ticketType: "message",
                    ticketToggle: "true"
                  })
                });
             })
                 }).catch(err => {  message.channel.send(new discord.MessageEmbed().setColor("RED").setDescription("The time has ended, prompt ended"))
console.log(err)
                 })
              })
              }).catch(err => { message.channel.send(new discord.MessageEmbed().setColor("RED").setDescription("The time has ended, prompt ended"))})
            })
           }).catch(err => { message.channel.send(new discord.MessageEmbed().setColor("RED").setDescription("The time has ended, prompt ended"))})
          })
        }*/
      }).catch(err => { message.channel.send(new discord.MessageEmbed().setColor("RED").setDescription("The time has ended, prompt ended"))})
    })
  }

module.exports.help = {
	name: "ticketsetup",
	aliases: ["tsetup"],
	description: "TicketSetup commmand for creating tickets in your server",
	usage: "ticketsetup",
	category: "Tickets",
    
};