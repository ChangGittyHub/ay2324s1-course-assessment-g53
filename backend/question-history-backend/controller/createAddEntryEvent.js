// Import the Question model from its file path
const Question = require("../model/QuestionHistory.js");
const jwt = require("jsonwebtoken");

const SECRET_KEY = "yourSecretKey"

// Define the getQuestions function
const createAddEntryEvent  = async (req, res) => {

  try {
    // It will error out if not verifiable
    const user_id = await jwt.verify(req.body.user_cookie, SECRET_KEY).user_data.user_id;

    Question.deleteMany(
      {userid: user_id,
        question_title: req.body.question.title})
    .then(() => {
      Question.create({
        userid: user_id,
        question_title: req.body.question.title,
        question_description: req.body.question.description,
        categories: req.body.question.categories,
        last_attempt: req.body.timestamp, 
        attempt: req.body.attempt,
        complexity: req.body.question.complexity,
      })
    })
    // .then(() => {
    //   Question.find({})
    //   .then((res) => console.log(res.length))
    // })       
  } catch (e) {
    console.log(e)
    res.status(500).send(err.message);
  }
  
};

module.exports = {
  createAddEntryEvent,
};
