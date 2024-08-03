import { Router } from "express";
import {  
  createReview,
  editReview,
  deleteReview,
  fetchReviewByProductId,
  fetchReviewByUserId
} from "../controllers/review.controller.js";
import { verifyJwt } from "../middleware/auth.middleware.js";
import { upload } from "../middleware/multer.middleware.js";


const router = Router();
const images = 'images';

router.route('/add-review').post(verifyJwt, upload.array(images), createReview)
router.route('/view-review-user').get(verifyJwt, fetchReviewByUserId)
router.route('/view-review-product').get(verifyJwt, fetchReviewByProductId)
router.route('/delete-review').post(verifyJwt, deleteReview)
router.route('/update-review').patch(verifyJwt,upload.array(images), editReview)


export default router


