const { Client, Collection } = require("discord.js");
const discord = require("discord.js")
const Discord = require("discord.js")
const config = require("./config.js")
const fs = require("fs")
const { readdirSync } = require("fs");
const { sep } = require("path");
const { success, error, warning } = require("log-symbols"); 
const mongoose = require("mongoose")

const bot = new Client({ 
	partials: ['MESSAGE', 'REACTION'],
	ws: { intents: ["GUILDS", "GUILD_MEMBERS", "GUILD_MESSAGES", "GUILD_EMOJIS", 'GUILD_MESSAGE_REACTIONS'] }
});

bot.config = config;

["commands", "aliases"].forEach(x => bot[x] = new Collection());

const load = (dir = "./commands/") => {

	readdirSync(dir).forEach(dirs => {
		const commands = readdirSync(`${dir}${sep}${dirs}${sep}`).filter(files => files.endsWith(".js"));
		for (const file of commands) {
			const pull = require(`${dir}/${dirs}/${file}`);
			if (pull.help && typeof (pull.help.name) === "string" && typeof (pull.help.category) === "string") {
				if (bot.commands.get(pull.help.name)) return console.warn(`${warning} Two or more commands have the same name ${pull.help.name}.`);
				bot.commands.set(pull.help.name, pull);
				console.log(`${success} Loaded command ${pull.help.name}.`);

			}
			else {
				//console.log(`${error} Error loading command in ${dir}${dirs}. you have a missing help.name or help.name is not a string. or you have a missing help.category or help.category is not a string`);
				continue;
			}
			if (pull.help.aliases && typeof (pull.help.aliases) === "object") {
				pull.help.aliases.forEach(alias => {
					if (bot.aliases.get(alias)) return console.warn(`${warning} Two commands or more commands have the same aliases ${alias}`);
					bot.aliases.set(alias, pull.help.name);
				});
			}
		}
	});
};

load();


bot.on("ready", () => {
	mongoose.connect(config.mongoDB, {
		useNewUrlParser: true,
		useUnifiedTopology: true
	  }).then(() => {
		//If it connects log the following
		console.log("Connected to the Mongodb database.");
	  }).catch((err) => {
		//If it doesn't connect log the following
		cconsole.log("Unable to connect to the Mongodb database. Error: " + err);
	  });
	console.log("I am online");
});

bot.on("message", async message => {
	if(message.author.bot) return 
	let sellChannel = message.guild.channels.cache.find(ch => ch.name === config.sellChannel)
	if(!sellChannel) return
	let buyChannel = message.guild.channels.cache.find(ch => ch.name === config.buyChannel)
	if(!buyChannel) return

	let channelIDs = [sellChannel.id, buyChannel.id]
	if(channelIDs.includes(message.channel.id)) {
		let filter = ["ign", "item", "price"]
		let del = []
		let authorSend = []
			for(let i = 0; i < filter.length; i++) {
			if(!message.content.toLowerCase().includes(filter[i])) {
			del.push(filter[i])
			authorSend.push(filter[i])
			}
		}
		if(del.length > 0 && del.length < 3) {
			message.delete()
		}
		if(authorSend.length > 0 && authorSend.length < 3) {
			message.channel.send(new discord.MessageEmbed().setColor("RED").setDescription("Please follow the format that is currently pinned in the channel " + `${message.channel}`)).then(m => m.delete({timeout: 5000}))
		}
		else if(!filter.some(word => message.content.toLowerCase().includes(word))) {
			message.delete()
			message.channel.send(new discord.MessageEmbed().setColor("RED").setDescription("Please follow the format that is currently pinned in the channel " + `${message.channel}`)).then(m => m.delete({timeout: 5000}))
		}
	}
    
    const prefix = bot.config.prefix;
	const args = message.content.slice(prefix.length).trim().split(/ +/g);
	const cmd = args.shift().toLowerCase();
    
const suggestSchema =  require("./schemas/suggestion")
        let suggestionChannel = message.guild.channels.cache.find(ch => ch.name === config.suggestChannel)
    if(message.channel.id === suggestionChannel.id) {
        if(message.member.roles.cache.some(rl => rl.name === "Founders") || message.member.roles.cache.some(rl => rl.name === "Co-Owners" || message.member.roles.cache.some(rl => rl.name === "Head Admins"))) {
    let command;

	if (message.author.bot || !message.guild) return;

	if (!message.member) message.member = await message.guild.fetchMember(message.author);

	if (!message.content.startsWith(prefix)) return;

	if (cmd.length === 0) return;
	if (bot.commands.has(cmd)) command = bot.commands.get(cmd);
	else if (bot.aliases.has(cmd)) command = bot.commands.get(bot.aliases.get(cmd));

	if (!message.channel.permissionsFor(message.guild.me).has('EMBED_LINKS'))
	return message.channel.send(`${message.author.tag}, I do not have the embed links permission`)
	if(!message.channel.permissionsFor(message.guild.me).has("SEND_MESSAGES")) return

	if (command) command.run(bot, message, args);
            return
        }
        
    let alreadySuggested = await suggestSchema.findOne({
        userWhoSuggested: message.author.tag
    })

    //message.delete()
    let suggestMessage = message.content
    let suggestFilter = ["sethome", "sethome!", "/home", "/tpa", "tpa", "setihume", "home", "tp", "/tp" ]
    if(suggestFilter.some(word => suggestMessage.toLowerCase().includes(word))) {
    message.delete()
return message.author.send(new Discord.MessageEmbed().setColor("RED").setDescription("Your suggestion has a filtered word and it will not be sent.")).catch(() => {})
}
    let embed = new Discord.MessageEmbed()
    .setColor("BLUE")
    .setTitle("New Suggestion")
    .setDescription(suggestMessage)
    .setFooter("Suggested by " + `${message.author.tag}`)

    let sent = await suggestionChannel.send(embed).then(async(m) => {
        let content = message.content
        let contentID = m.id
        
 if(!alreadySuggested) {
      let newSuggest = await suggestSchema.create({
        suggestion: content,
        userWhoSuggested: message.author.tag,
        userWhoSuggestedID: message.author.id,
        suggestionID: contentID
        })
      newSuggest.save()
    }
        console.log(`${message.author.tag}\n${suggestMessage}\n${message.author.id}\n${m.id}\n${newSuggested}\n${m}`)
        console.log(m.id)
        m.react("850292488920104970").catch((err) => {
        console.log(err)
        return message.author.send(new Discord.MessageEmbed().setColor("RED").setDescription("Your suggest was sent but I do not have permissions to add reactions")).catch(() => {})
    })
    m.react("850292420679434270").catch((err) => {
        console.log(err)
        return message.author.send(new Discord.MessageEmbed().setColor("RED").setDescription("Your suggest was sent but I do not have permissions to add reactions"))
    })
    })
    .catch(err => { 
        return message.author.send(new Discord.MessageEmbed().setColor("RED").setDescription(`There was an error: ${err} (Please send it to W-Legit)`)).catch(() => {})
    })
    
    
message.author.send(new Discord.MessageEmbed().setColor("GREEN").setDescription("You suggestion has been sent"))
    .catch(() => {}) 
        
    }
    
    
	
    
    const code = message.content
    if(code.length === 4 && !isNaN(code)){
  
        message.reply(`Please do not send the code here **(read <#817742118894305280> for more info)**`)
        message.author.send(`Hey ${message.author.tag} If you were attempting to verify yourself send **${code}** here.`)
        
        
        return;
        
    }
	let command;

	if (message.author.bot || !message.guild) return;

	if (!message.member) message.member = await message.guild.fetchMember(message.author);

	if (!message.content.startsWith(prefix)) return;

	if (cmd.length === 0) return;
	if (bot.commands.has(cmd)) command = bot.commands.get(cmd);
	else if (bot.aliases.has(cmd)) command = bot.commands.get(bot.aliases.get(cmd));

	if (!message.channel.permissionsFor(message.guild.me).has('EMBED_LINKS'))
	return message.channel.send(`${message.author.tag}, I do not have the embed links permission`)
	if(!message.channel.permissionsFor(message.guild.me).has("SEND_MESSAGES")) return

	if (command) command.run(bot, message, args);
});

readdirSync('./events').forEach(folder => {
	readdirSync(`./events/${folder}`).forEach(file => {
	  const event = require(`./events/${folder}/${file}`);
	  bot.on(file.split('.')[0], event.bind(null, bot));
	});
  });

bot.login(bot.config.token).catch(e => { console.log(e) });