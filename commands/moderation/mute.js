const Discord = require("discord.js");
const ms = require("ms");
const fs = require("fs");
const config = require("../../config");
const { Z_DEFAULT_COMPRESSION } = require("zlib");
module.exports.run = async (client, message, args) => {
	const tomute = message.mentions.users.first();
	const notice3 = new Discord.MessageEmbed()
		.setDescription(
			"**I don't have permission to mute people!**"
		)
		.setColor("RED");
	if (!message.guild.member(client.user).hasPermission("MANAGE_ROLES")) {
		return message.channel.send(notice3)
	}

	//! tempmute @user 1s/m/h/d
	const embed6 = new Discord.MessageEmbed()
		.setDescription(
			`${message.author.username}, you do not have the manage roles permission`
		)
		.setColor("RED");
	if (!message.member.hasPermission("MANAGE_ROLES")) {
		return message.channel.send(embed6)
	}
	const embed50 = new Discord.MessageEmbed()
		.setTitle(`Command: ${config.prefix}mute`)
		.setDescription(`"Usage: ${config.prefix}mute @user length reason`)
		.setColor(0xff0000)
	if (!tomute) return message.channel.send(embed50);
	const notice2 = new Discord.MessageEmbed()
		.setDescription(
			"**You cannot mute yourself!**"
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
			"The maximum number of days of muting someone is 14 days, please do not exceed this number."
		)
		.setColor("RED");
	const dddfs = new Discord.MessageEmbed()
		.setDescription(
			"You did not type how long the user will be muted for"
		)
		.setColor("RED");
	const botRolePossition = message.guild.member(client.user).roles.highest
		.position;
	const rolePosition = message.guild.member(tomute).roles.highest.position;
	const userRolePossition = message.member.roles.highest.position;
	if (userRolePossition <= rolePosition) return message.channel.send(dsfdsfsdf);
	if (botRolePossition <= rolePosition)
		return message.channel.send(sdfsdfsdfsd);

	let muterole = message.guild.roles.cache.find(val => val.name.toLowerCase() === "muted");
	if (!muterole) {
		return message.channel.send(new Discord.MessageEmbed().setColor("RED").setDescription("I am not able to find a mute role to mute the user"))
		/*
		try{
			muterole = await message.guild.roles.create({
				name: "Muted",
				color: "#000000",
			})
			message.guild.channels.cache.forEach(async (channel, id) => {
				 await channel.updateOverwrite(muterole, {
					SEND_MESSAGES: false,
					ADD_REACTIONS: false,
				});
			})
		} catch(e) {
			console.log(e)
		}*/
	}

	const mutetime = args[1];
	if (!mutetime) return message.channel.send(embed50);
	if (isNaN(ms(mutetime))) return message.channel.send(sdfsdfsdfsssd);
	if (ms(mutetime) > 1209600000) return message.channel.send(dddfs);
	let reason = args.slice(2).join(" ");
	if (reason.length < 1) reason = "No reason given.";

	const logs = message.guild.channels.cache.find(x => x.name === config.modLogChannel);

	const embed = new Discord.MessageEmbed()
		.setTitle("Action Mute")
		.setColor("RED")
		.addField("Target", `<@${tomute.id}>`)
		.addField("User", `<@${message.author.id}>`)
		.addField("TempMute Length", `${ms(ms(mutetime))}`)
		.addField("Reason", `\`\`\`${reason}\`\`\``)
		.setTimestamp()
		.setFooter("• Mute User Information");

	const embed10 = new Discord.MessageEmbed()
		.setDescription(
			`**Muted ${tomute} for ${ms(ms(mutetime))}** | **${reason}**`
		)
		.setColor("GREEN");

	await message.guild.member(tomute).roles.add(muterole);
	;
	message.channel.send(embed10);
	if(logs) {
	logs.send(embed)
	}
	setTimeout(() => {
		message.guild.member(tomute).roles.remove(muterole.id);
	}, ms(mutetime));
}

module.exports.help = {
	name: "mute",
	aliases: ["m"],
	description: "Mute command to Mute members off your server",
	usage: "mute <user> <time s|h|d> <reason>",
	category: "Moderation",
};