import express from "express";
import { isAdmin, isAuth } from "./../middlewares/authMiddleware.js";
import {
    createCategory,
    deleteCategoryController,
    getAllCategoriesController,
    updateCategoryController,
    updateFullCategoryController,
} from "../controllers/categoryController.js";

const router = express.Router();

//rroutes
// ============== CAT ROUTES ==================

// CREATE CATEGORY
router.post("/create", isAuth, isAdmin, createCategory);

// GET ALL CATEGORY
router.get("/get-all", getAllCategoriesController);

// DELETE  CATEGORY
router.delete("/delete/:id", isAuth, isAdmin, deleteCategoryController);

// UPDATE ALL CATEGORY
router.put("/update/:id", isAuth, isAdmin, updateCategoryController);

// UPDATE ALL FIELD CATEGORY
router.put("/update-all/:id", isAuth, isAdmin, updateFullCategoryController);

// ====================================================================

export default router;
