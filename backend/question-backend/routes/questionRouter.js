import express from "express";

import { checkLogin } from "../middleware/checkLogin.js";
import { checkAdmin } from "../middleware/checkAdmin.js";

import { getQuestions } from "../controller/getQuestions.js";
import { addQuestion } from "../controller/addQuestion.js";
import { updateQuestion } from "../controller/updateQuestion.js";
import { deleteQuestion } from "../controller/deleteQuestion.js";
import { getQuestionsByComplexity } from "../controller/getQuestionsByComplexity.js"

 const router = express.Router();

 router.get("/", getQuestions);
 router.get("/:complexity", getQuestionsByComplexity);
 router.post("/", [checkLogin, checkAdmin], addQuestion);
 router.put("/", [checkLogin, checkAdmin], updateQuestion);
 router.delete("/:id", [checkLogin, checkAdmin], deleteQuestion);


 export default router;
