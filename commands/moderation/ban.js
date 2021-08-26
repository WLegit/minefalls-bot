const Discord = require("discord.js")
const config = require("../../config")
module.exports.run = (client, msg, args) => {
	const notice3 = new Discord.MessageEmbed()
		.setDescription("**I do not have permission to ban people!**")
		.setColor("RED");
	if (!msg.guild.member(client.user).hasPermission("BAN_MEMBERS")) {
		return msg.channel.send(notice3)
	}

	const banTaged = msg.mentions.members.first() || msg.guild.members.cache.get(args[0])
	let reason = args.slice(1).join(" ");

	const mmqembed = new Discord.MessageEmbed()
		.setDescription(`${msg.author.username}, you do not have permission to ban members`)
		.setColor("#FFFF00");
	if (!msg.member.hasPermission("BAN_MEMBERS")) {
		return msg.channel
			.send(mmqembed)
	}
	const kntlembed = new Discord.MessageEmbed()
		.setTitle(`Command: ${config.prefix}ban`)
		.setDescription(
			`Wrong Usage!\n\n**Function:** Ban a member\n**Usage:**  ${config.prefix}ban [User] [Reason]\n**Example:**  ${config.prefix}ban @MentoBento Noob`
		)
		.setColor("RED");
	if (!banTaged) {
		msg.delete();
		return msg.channel
			.send(kntlembed)
	}
	const notice2 = new Discord.MessageEmbed()
		.setDescription("**You cannot ban your self**")
		.setColor("RED");
	if (banTaged.id === msg.author.id) {
		return msg.channel
			.send(notice2)
	}
	const dsfdsfsdf = new Discord.MessageEmbed()
		.setDescription(
			"**That member has roles higher or equal to you!**"
		)
		.setColor("RED");
	const sdfsdfsdfsd = new Discord.MessageEmbed()
		.setDescription(
			"*That member has roles higher or equal to me!**"
		)
		.setColor("RED");
	const botRolePossition = msg.guild.member(client.user).roles.highest.position;
	const rolePosition = msg.guild.member(banTaged).roles.highest.position;
	const userRolePossition = msg.member.roles.highest.position;
	if (userRolePossition <= rolePosition) return msg.channel.send(dsfdsfsdf);
	if (botRolePossition <= rolePosition) return msg.channel.send(sdfsdfsdfsd);

	const sdfdfsdfsdfdfs = new Discord.MessageEmbed()
		.setDescription(
			"**An error occurred with banning that member!**"
		)
		.setColor("RED");

	if (reason.length < 1) reason = "No reason given.";

	if (!msg.guild.member(banTaged).bannable) {
		return msg.channel.send(sdfdfsdfsdfdfs);
	}

	const banEmbed = new Discord.MessageEmbed()
		.setColor("RED")
		.setAuthor("Action Ban")
		.addField("Target", `<@${banTaged.id}>`)
		.addField("User", `**<@${msg.author.id}>**`)
		.addField("Reason", `\`\`\`${reason}\`\`\``)
		.setTimestamp()
		.setFooter("• Ban User Information"); //
	const bsuembed = new Discord.MessageEmbed()
		.setDescription(
			`**Banned ${banTaged}** | **${reason}**`
		)
		.setColor("GREEN");

	msg.delete();
	msg.channel.send(bsuembed);
	msg.guild.members.ban(banTaged, { reason });
	
	let logchannel = msg.guild.channels.cache.find(ch => ch.name === config.modLogChannel)
	if(logchannel) {
		logchannel.send(banEmbed)
	}
}

module.exports.help = {
	name: "ban",
	aliases: ["b"],
	description: "Ban command to ban members off your server",
	usage: "ban <user> <reason>",
	category: "Moderation",
};