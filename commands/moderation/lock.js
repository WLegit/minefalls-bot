const Discord = require("discord.js")
const config = require("../../config")
module.exports.run = (client, message, args) => {
	const notice3 = new Discord.MessageEmbed()
	.setDescription("**I do not have permission to manage channels**")
	.setColor("RED");
	if (!message.guild.member(client.user).hasPermission("MANAGE_CHANNELS")) {
	return message.channel.send(notice3)
}
const mmqembed = new Discord.MessageEmbed()
.setDescription(`${msg.author.username}, you do not have permission to manage channels`)
.setColor("#FFFF00");
if (!msg.member.hasPermission("MANAGE_CHANNELS")) {
return msg.channel
	.send(mmqembed)
}

	const channel = message.mentions.channels.first() || message.channel
	let everyone = message.guild.roles.everyone
	channel.updateOverwrite(
		everyone,
		{ 'SEND_MESSAGES': false }
	)
	message.channel.send(new Discord.MessageEmbed().setColor("GREEN").setDescription("**Successfully locked the channel**"))	
}

module.exports.help = {
	name: "lock",
	aliases: ["l"],
	description: "Lock command to lock channels off your server",
	usage: "lock <channel>",
	category: "Moderation",
};