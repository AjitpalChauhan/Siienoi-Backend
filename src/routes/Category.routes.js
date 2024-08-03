import { Router } from "express";
import {  
  createCategory,
  deleteCategory,
  viewCategory,
  editCategory,
  viewAllCategory
} from "../controllers/category.controller.js";
import { verifyJwt } from "../middleware/auth.middleware.js";

const router = Router();

router.route('/create-category').post(verifyJwt, createCategory)
router.route('/view-all-categories').get(verifyJwt, viewAllCategory)
router.route('/view-category/:_id').get(verifyJwt, viewCategory)
router.route('/delete-category/:_id').delete(verifyJwt, deleteCategory)
router.route('/update-category/:_id').patch(verifyJwt, editCategory)


export default router


