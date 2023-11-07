// Import the Question model from its file path
const Question = require('../model/QuestionHistory');

// Define the getQuestions function
const getQuestionsHistory = async(req, res) => {
    try {
        res.send("hello from BE")
        console.log("hello from BE")

        // // Extract userID from the request parameters
        // const userID = req.params.userID;
        
        // // Find questions by userID
        // const questions = await Question.find({ userid: userID });
        // console.log("backend", questions);

        // // If no questions found, return 404
        // if (!questions || questions.length === 0) {
        //     return res.status(404).send('No questions found for the given user.');
        // }

        // // Send back the list of questions
        // res.send(questions);
    } catch (err) {
        // Log the error and return a 500 status code
        console.error(err);
        res.status(500).send('Error retrieving questions: ' + err.message);
    }
}

module.exports = {
    getQuestionsHistory
}
