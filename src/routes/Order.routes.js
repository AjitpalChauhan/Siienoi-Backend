import { Router } from "express";
import {  createOrder,
  updateOrder,
  fetchAllOrders,
  fetchOrderByOrderNumber,
  deleteOrder,
  addProductFromCart,
  DirectBuyOrder
 } from "../controllers/order.controller.js";
import { verifyJwt, isAdmin } from "../middleware/auth.middleware.js";

const router = Router();

router.route('/create-order').post(verifyJwt, createOrder)
router.route('/order-from-cart').get(verifyJwt, addProductFromCart)
router.route('/direct-order').get(verifyJwt, DirectBuyOrder)
router.route('/all-orders').get(verifyJwt, fetchAllOrders)
router.route('/single-order/:_id').get(verifyJwt, fetchOrderByOrderNumber)
router.route('/delete-order/:_id').delete(verifyJwt, deleteOrder)
router.route('/update-order/:orderId').patch(verifyJwt, updateOrder)
router.route('/admin/update-order/:_id').patch(verifyJwt, isAdmin, updateOrder)

router.route('/test-middleware').get(verifyJwt, (req, res) => {
  res.status(200).json({
    message: "Middleware passed!",
    user: req.user,
  });
});


export default router


