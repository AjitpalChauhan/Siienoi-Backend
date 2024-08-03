import { Router } from "express";
import {  
  addAddress,
  updateAddress,
  deleteAddress,
  fetchAddressesByUser,
  fetchAddressById
} from "../controllers/address.controller.js";
import { verifyJwt } from "../middleware/auth.middleware.js";

const router = Router();

router.route('/add-address').post(verifyJwt, addAddress)
router.route('/view-all-addresses').get(verifyJwt, fetchAddressesByUser)
router.route('/view-address/:_id').get(verifyJwt, fetchAddressById)
router.route('/delete-address/:_id').delete(verifyJwt, deleteAddress)
router.route('/update-address/:_id').put(verifyJwt, updateAddress)


export default router


