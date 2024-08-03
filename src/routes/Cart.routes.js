import { Router } from "express";
import {  addToCart,
  fetchCartByUserId,
  deleteFromCart,
  updateCart,
  emptyCart } from "../controllers/cart.controller.js";
import { verifyJwt } from "../middleware/auth.middleware.js";

const router = Router();

router.route('/add-to-cart').post(verifyJwt, addToCart)
router.route('/user-Cart').get(verifyJwt, fetchCartByUserId)
router.route('/delete-Cart/:_id').delete(verifyJwt, deleteFromCart)
router.route('/empty-Cart/:_id').delete(verifyJwt, emptyCart)
router.route('/update-Cart/:_id').patch(verifyJwt, updateCart)

router.route('/test-middleware').get(verifyJwt, (req, res) => {
  res.status(200).json({
    message: "Middleware passed!",
    user: req.user,
  });
});


export default router


