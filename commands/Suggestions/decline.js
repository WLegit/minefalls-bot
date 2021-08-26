const Discord = require("discord.js")
const config = require("../../config")
const suggestSchema =  require("../../schemas/suggestion.js")

module.exports.run = async (client, message, args) => {
    if(!message.member.hasPermission("MANAGE_MESSAGES")) return message.channel.send(new Discord.MessageEmbed().setColor("RED").setDescription("You do not have the manage messages permission"))
    if(!args[0]) return message.channel.send(new Discord.MessageEmbed().setColor("RED").setDescription("Please specify a valid message ID in the current channel."))
    
    let reason = args.slice(1).join(" ")
    if(!reason) reason = "No reason given."
    
    let found = await suggestSchema.findOne({
        suggestionID: args[0]
    }).catch((err) => { message.channel.send(err) })
    console.log(found + "\n" + args[0])

    let sug
    let u
    if(!found) {
        return message.channel.send(new Discord.MessageEmbed().setColor("RED").setDescription("This suggestion was already accepted/declined or it was removed from my database"))
        .then(m => m.delete({ timeout: 5000 }))
    } else {
        sug = found.suggestion
        u = found.userWhoSuggested
    }

    await message.channel.messages.fetch(args[0])
    .then(async m => {

 
        let embed = new Discord.MessageEmbed()
        .setColor("RED")
        .setTitle("New Suggestion")
        .setDescription(sug + `\n\nDeclined By: ${message.author.tag}\nReason: ${reason}`)
        .setFooter("Suggested by " + `${u}`)

        m.edit(embed)
        .catch(err => {
            return message.channel.send(new Discord.MessageEmbed().setColor("RED").setDescription("The messageID you provided is not my message"))
        })

        await suggestSchema.findOneAndDelete({
            suggestion: found.suggestion,
            userWhoSuggested: found.userWhoSuggested,
            suggestionID: found.suggestionID,
            userWhoSuggestedID: found.userWhoSuggestedID
        })

        message.channel.send(new Discord.MessageEmbed().setColor("GREEN").setDescription("Successfully rejected the suggestion | " + reason))
        .then(m => m.delete({ timeout: 5000 }))
        message.delete()
    })
    .catch(err => {
        console.log(err)
        return message.channel.send(new Discord.MessageEmbed().setColor("RED").setDescription("Please specify a valid message ID in the current channel."))
    })
}

module.exports.help = {
	name: "decline",
	aliases: ["dec", "deny"],
	description: "Decline commmand for declining suggestions in your server",
	usage: "decline <messageID>",
	category: "Suggestions",
};