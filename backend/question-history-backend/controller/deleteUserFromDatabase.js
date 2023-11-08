// Import the Question model from its file path
const Question = require("../model/QuestionHistory.js");

// Define the getQuestions function
const deleteUserFromDatabase  = async (req, res) => {
  Question.deleteMany({userid: req.params.userID})
  // .then(() => {
  //   Question.find({})
  //   .then((res) => console.log(res.length))
  // })
};

module.exports = {
  deleteUserFromDatabase,
};
