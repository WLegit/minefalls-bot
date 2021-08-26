const { MessageEmbed } = require("discord.js");
const afk = require("../../schemas/afk.js")
const moment = require("moment") 

module.exports.run = async(bot, message, args) => {

  const results = await afk
    .find()
    .sort({ms: -1})
    .limit(10)
  
  const array = [] 
  let i = 0
  for (let result of results) {
      
     i++
     array.push(`**${i}-** <@${result.id}> - \`${(result.ms / 3600000).toFixed(2)}h\`\n`)
      
      
      
  }
    
    
    const embed = new MessageEmbed()
    .setTitle(`Gamebyte | AFK Leaderboard`)
    .setDescription(array.join("\n"))
    .setColor("GREEN")
    .setFooter("https://gamebyte.wtf")
    
    message.channel.send(embed)
      

};

module.exports.help = {
	name: "leaderboard",
	aliases: ["lb"],
	description: "checks leaderboard",
	usage: "lb",
	category: "Misc",
};