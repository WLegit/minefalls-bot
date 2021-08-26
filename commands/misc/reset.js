const { MessageEmbed } = require("discord.js");
const afk = require("../../schemas/afk.js")
const moment = require("moment") 

module.exports.run = async(bot, message, args) => {


if(message.author.id === "710465231779790849") {

  const results = await afk
    .find()

  

  for (let result of results) {
      
     await result.updateOne({
     updated: Date.now(),
     s: 0,
     ms: 0
     })
      
     
  }
    
    
 
    
    return message.channel.send(`done, ${results.length} reseted`)
      
} else {
    return message.channel.send(`You can't use this command, it can be only used by **Peter_#4444**`);
}
};

module.exports.help = {
	name: "reset",
	aliases: [""],
	description: "Reset's afk (owner)",
	usage: "reset",
	category: "Misc",
};