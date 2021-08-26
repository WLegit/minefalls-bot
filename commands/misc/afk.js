const { MessageEmbed } = require("discord.js");
const afk = require("../../schemas/afk.js")
const moment = require("moment") 

module.exports.run = async(bot, message, args) => {

let userName = message.mentions.members.first() || message.author

const user = await afk.findOne({
id: userName.id
})

if(!user) return message.channel.send(`No Data Recorded`)
 let uptime = user.ms || 0


      let seconds = uptime / 1000;
      let days = parseInt(seconds / 86400);
      seconds = seconds % 86400;
      let hours = parseInt(seconds / 3600);
      seconds = seconds % 3600;
      let minutes = parseInt(seconds / 60);
      seconds = parseInt(seconds % 60);
    
      uptime = `${seconds}s`;
      if (days) {
        uptime = `${days} days, ${hours} hours, ${minutes} minutes, ${seconds} seconds`;
      }
      else if (hours) {
        uptime = `${hours} hours, ${minutes} minutes and ${seconds} seconds`;
      }
      else if (minutes) {
        uptime = `${minutes} minutes and ${seconds} seconds`;
      }
      else if (seconds) {
        uptime = `${seconds} seconds`;
      }
      
const embed = new MessageEmbed()
.setTitle(`${userName} | AFK Stats`)
.setDescription(`${user.ms && user.s && user.updated ? `You have been afk for **${uptime}**\n\n__**Full Statistics:**__\n**Hours:** ${(user.ms / 3600000).toFixed(2)}h \n**Minutes:** ${(user.ms /  60000).toFixed(2)}m \n**Seconds:** ${user.s}s\n\n**Last AFKed At:** ${!isNaN(user.updated) ? `${moment(user.updated).format('MMMM Do YYYY, h:mm:ss a')} (${!isNaN(user.s) ? moment(user.updated).fromNow() : "none"}) (UTC - Coordinated Universal Time)` : "Never Afked"  }` : "No Data Recorded"}`)
.setFooter(`ID: ${userName.id}`)
.setColor('GREEN')

message.channel.send(embed)
};

module.exports.help = {
	name: "afk",
	aliases: ["a"],
	description: "Checks your afk Statistics",
	usage: "afk",
	category: "Misc",
};