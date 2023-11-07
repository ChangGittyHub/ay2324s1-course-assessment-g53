const express = require("express");
const router = express.Router();
const dotenv = require("dotenv")
const {getQuestionsHistory} = require("../controller/getUserQuestionHistory.js")

dotenv.config({
    path: ".env.local"
})

router.get("/", getQuestionsHistory)

module.exports = router;