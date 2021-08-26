const discord = require("discord.js")
const config = require("../../config")

module.exports.run = async (client, message, args) => {
	const notice3 = new discord.MessageEmbed()
	.setDescription("**I do not have permission to ban people!**")
	.setColor("RED");
	if (!message.guild.member(client.user).hasPermission("BAN_MEMBERS")) return message.channel.send(notice3)

	if(!message.member.hasPermission("BAN_MEMBERS")) return message.channel.send(new discord.MessageEmbed().setColor("RED").setDescription(`${msg.author.username}, you do not have permission to ban members`))

	let member = args[0]
	if(!args[0]) return message.channel.send(new discord.MessageEmbed().setColor("RED").setTitle(`Command: ${config.prefix}hackban`)
	.setDescription(`Wrong Usage!\n\n**Function:** HackBan a member\n**Usage:**  ${config.prefix}hackban [UserID] [Reason]\n**Example:**  ${config.prefix}hackban 640793731267559441 Noob`))

	let reason = args[1]
	if(!reason) reason = "No reason given."

	await client.users.fetch(args[0])
	.then(async user => {
		await message.guild.members.ban(user.id)
		message.channel.send(new discord.MessageEmbed().setColor("GREEN").setDescription(`HackBanned ${user} | ${reason}`))

		let embed = new discord.MessageEmbed()
		.setColor("RED")
		.setAuthor("Action HackBan")
		.addField("Target", `<@${user.id}>`)
		.addField("User", `**<@${message.author.id}>**`)
		.addField("Reason", `\`\`\`${reason}\`\`\``)
		.setTimestamp()
		.setFooter("• HackBan User Information");

		let logchannel = message.guild.channels.cache.find(ch => ch.name === config.modLogChannel)
		if(logchannel) {
		logchannel.send(embed)
		}
	})
	.catch(err => {
		return message.channel.send(new discord.MessageEmbed().setColor("RED").setTitle(`Command: ${config.prefix}hackban`)
		.setDescription(`An error has occured: ${err}`))
	})
}

module.exports.help = {
	name: "hackban",
	aliases: ["hb"],
	description: "Hackban command to hackban members off your server without being in it",
	usage: "hackban <user> <reason>",
	category: "Moderation",
};