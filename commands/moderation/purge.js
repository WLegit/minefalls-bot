const Discord = require("discord.js")
const config = require("../../config")
module.exports.run = (client, message, args) => {
	let embed6 = new Discord.MessageEmbed()
		.setDescription(
			`${message.author.username}, you do not have the manage messages permission`
		)
		.setColor("RED");
	if (!message.member.hasPermission("MANAGE_MESSAGES"))
		return message.channel.send(embed6)
	if (!args[0] || isNaN(args[0]) || args[0] > 100)
		return message.channel
			.send(`Use: **\`${config.prefix}clear <1 - 100>\`**`)
			

	let embed = new Discord.MessageEmbed()
		.setColor("GREEN")
		.setTitle("Clear Action")
		.addField("User", `<@${message.author.id}> `)
		.addField("Cleared", `**${args[0]}**`)
		.addField("Channel", `${message.channel} | **${message.channel.name}**`);

	let kntlembed = new Discord.MessageEmbed()
		.setColor("GREEN")
		.setDescription(`Cleared **${args[0]}** Message here`);

	try {
        
		message.channel.bulkDelete(args[0]).then(() => {
			message.channel.send(kntlembed).then((s)=>{
                s.delete({timeout: 5000})
            });
			let logchannel = message.guild.channels.cache.find(ch => ch.name === config.modLogChannel)
			if(logchannel) {
				logchannel.send(embed)
			}
		});
	} catch (e) {
		let embedssss = new Discord.MessageEmbed()
			.setTitle(`**Clearing Messages**`)
			.setDescription(
				`
            **Error:**
						\`\`\`${e}\`\`\``
			)
			.setColor("#ff0000");

		return message.channel
			.send(embedssss)
	}
}

module.exports.help = {
	name: "purge",
	aliases: ["p", "clear"],
	description: "Purge command to purge messages off your server",
	usage: "kcik <user> <reason>",
	category: "Moderation",
};