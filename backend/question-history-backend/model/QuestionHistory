const { Schema, model } = require("mongoose")

const quesHistorySchema = new Schema({
    userid: Number,
    question_title: String,
    question_description: String,
    categories: [String],
    last_attempt: Date, 
    attempt: String,
    complexity: String,
});

module.exports = model("questionHistory", quesHistorySchema);