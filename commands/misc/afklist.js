const { MessageEmbed } = require("discord.js");
const afk = require("../../schemas/afk.js")
const moment = require("moment") 

module.exports.run = async(bot, message, args) => {

  const results = await afk
    .find()
 
  
  const array = [] 
  let i = 0
  for (let result of results) {
     if(result.updated){
         if(moment(result.updated).fromNow() === "a few seconds ago"){
     
  
     i++
     array.push(`**${i}-** <@${result.id}>`)
     }
     
     }
 
      
      
  }
    
    
    const embed = new MessageEmbed()
    .setTitle(`Gamebyte | People who afked this last minute [ ${array.length} people ]`)
    .setDescription(array.join("\n"))
    .setColor("GREEN")
    .setFooter("https://gamebyte.wtf")
    
    message.channel.send(embed)
      

};

module.exports.help = {
	name: "afklist",
	aliases: ["alist"],
	description: "checks everyone afking Online",
	usage: "afklist",
	category: "Misc",
};