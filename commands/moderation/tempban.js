const Discord = require("discord.js");
const ms = require("ms");
const fs = require("fs");
const config = require("../../config");
module.exports.run = async (client, message, args) => {
	const tomute = message.mentions.members.first();
	const notice3 = new Discord.MessageEmbed()
		.setDescription(
			"**I don't have permission to mute people!**"
		)
		.setColor("RED");
	if (!message.guild.member(client.user).hasPermission("BAN_MEMBERS")) {
		return message.channel.send(notice3)
	}

	//! tempmute @user 1s/m/h/d
	const embed6 = new Discord.MessageEmbed()
		.setDescription(
			`${message.author.username}, you do not have the ban members permission`
		)
		.setColor("RED");
	if (!message.member.hasPermission("BAN_MEMBERS")) {
		return message.channel.send(embed6)
	}
	const embed50 = new Discord.MessageEmbed()
		.setTitle(`Command: ${config.prefix}ban`)
		.setDescription(`"Usage: ${config.prefix}ban @user length reason`)
		.setColor(0xff0000)
	if (!tomute) return message.channel.send(embed50);
	const notice2 = new Discord.MessageEmbed()
		.setDescription(
			"**You cannot ban yourself!**"
		)
		.setColor("RED");
	if (tomute.id === message.author.id)
		return message.channel.send(notice2);

	const dsfdsfsdf = new Discord.MessageEmbed()
		.setDescription(
			"**That member has roles higher or equal to you!**"
		)
		.setColor("RED");
	const sdfsdfsdfsd = new Discord.MessageEmbed()
		.setDescription(
			"**That member has roles higher or equal to me!**"
		)
		.setColor("RED");
	const sdfsdfsdfsssd = new Discord.MessageEmbed()
		.setDescription(
			"The maximum number of days of banning someone is 14 days, please do not exceed this number."
		)
		.setColor("RED");
	const dddfs = new Discord.MessageEmbed()
		.setDescription(
			"You did not type how long the user will be banned for"
		)
		.setColor("RED");
	const botRolePossition = message.guild.member(client.user).roles.highest
		.position;
	const rolePosition = message.guild.member(tomute).roles.highest.position;
	const userRolePossition = message.member.roles.highest.position;
	if (userRolePossition <= rolePosition) return message.channel.send(dsfdsfsdf);
	if (botRolePossition <= rolePosition)
		return message.channel.send(sdfsdfsdfsd);


	const mutetime = args[1];
	if (!mutetime) return message.channel.send(embed50);
	if (isNaN(ms(mutetime))) return message.channel.send(sdfsdfsdfsssd);
	if (ms(mutetime) > 1209600000) return message.channel.send(dddfs);
	let reason = args.slice(2).join(" ");
	if (reason.length < 1) reason = "No reason given.";

	const logs = message.guild.channels.cache.find(x => x.name === config.modLogChannel);

	const embed = new Discord.MessageEmbed()
		.setTitle("Action TempBan")
		.setColor("RED")
		.addField("Target", `<@${tomute.id}>`)
		.addField("User", `<@${message.author.id}>`)
		.addField("Time", `${mutetime}`)
		.addField("Reason", `\`\`\`${reason}\`\`\``)
		.setTimestamp()
		.setFooter("• Mute User Information");

	const embed10 = new Discord.MessageEmbed()
		.setDescription(
			`**Banned ${tomute} for ${ms(ms(mutetime))}** | **${reason}**`
		)
		.setColor("GREEN");

	tomute.ban({ reason: reason })
	;
	message.channel.send(embed10);
	if(logs) {
	logs.send(embed)
	}
	setTimeout(async () => {
		console.log(tomute.id)
		console.log(tomute.user.id)
		const bans = await message.guild.fetchBans();
		let actUser = await client.users.fetch(tomute.user.id)
		if(actUser) { 
		await message.guild.members.unban(actUser).catch(err => { console.log(err) })
		}
	}, ms(mutetime));
}

module.exports.help = {
	name: "tempban",
	aliases: ["tb"],
	description: "Tempban command to tempban members off your server",
	usage: "tempban <user> <time> <reason>",
	category: "Moderation",
};