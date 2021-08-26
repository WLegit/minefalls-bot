const mongoose = require("mongoose")

let suggestions = mongoose.Schema({
    suggestion: { type: String },
    userWhoSuggested: { type: String },
    userWhoSuggestedID: { type: String },
    suggestionID: { type: String }
})

module.exports = mongoose.model("suggestions12", suggestions)