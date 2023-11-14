import express from "express";

import { checkLogin } from "../middleware/checkLogin.js";
import { checkAdmin } from "../middleware/checkAdmin.js";

import { getCategories } from "../controller/getCategories.js";
import { addCategory } from "../controller/addCategory.js";
import { deleteCategory } from "../controller/deleteCategory.js";
import { updateCategory } from "../controller/updateCategory.js";

const router = express.Router();

router.get("/", getCategories);
router.post("/", [checkLogin, checkAdmin], addCategory);
router.put("/:oldName", [checkLogin, checkAdmin], updateCategory);
router.delete("/:name", [checkLogin, checkAdmin], deleteCategory);

export default router;
