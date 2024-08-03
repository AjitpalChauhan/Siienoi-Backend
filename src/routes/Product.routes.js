import { Router } from "express";
import { addProduct,
  fetchAllProducts,
  fetchProductByCategory,
  sortProducts,
  deleteProduct,
  viewProductDetails,
  updateProductDetails
 } from "../controllers/product.controller.js";
import { upload } from "../middleware/multer.middleware.js";

const router = Router();

router.route('/add-product').post(
  upload.fields([
    {
      name: "images",
      maxCount:6
    },
    {
      name: "videos",
      maxCount: 4
    },
    {
      name: "thumbnail",
      maxCount: 1
    }
  ]),addProduct)

router.route('/all-products').get(fetchAllProducts)

router.route('/productDetails/:_id').get(viewProductDetails)

router.route('/update-product/:_id').patch(updateProductDetails)

router.route('/delete-product/:_id').delete(deleteProduct)

router.route('/sort-by-price/:order').get(sortProducts)

router.route('/product-by-category').get(fetchProductByCategory)

export default router