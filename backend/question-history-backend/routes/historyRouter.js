const express = require("express");
const router = express.Router();
const dotenv = require("dotenv")
const { getQuestionsHistory } = require("../controller/getUserQuestionHistory")
const { deleteUserFromDatabase } = require("../controller/deleteUserFromDatabase.js")
const { createAddEntryEvent } = require("../controller/createAddEntryEvent.js")

dotenv.config({
    path: ".env.local"
})

router.get("/questions/:userID", getQuestionsHistory);
router.post("/save_solution", createAddEntryEvent);
router.delete("/deleteUser/:userID", deleteUserFromDatabase);

module.exports = router;