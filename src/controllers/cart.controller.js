import mongoose from "mongoose";
import { Cart } from "../models/Cart.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/AsyncHandler.js";

const addToCart = asyncHandler(async (req, res) => {

  const {product, quantity = 1, size, color} = req.body
  const userId = req.user._id

  try {

    let cart = await Cart.findOne({user: userId})

    if(!cart){
      cart = new Cart({ user: userId, items: [{ product, quantity, size, color }] });
    } else {
      const productIndex = cart.items.findIndex(item => (item.product.toString() === product))

      if(productIndex > -1){
        cart.items[productIndex].quantity += quantity
      }else{
        cart.items.push({product, quantity, size, color})
      }
    }
    
    
    const savedCart = await cart.save()
    return res
    .status(200)
    .json(
      new ApiResponse(200, savedCart, "Product added to cart successfully")
    )
    
  } catch (error) {
    console.log("ERROR:",error)
    throw new ApiError(500, "Could not add the product to cart")
  }
})

const fetchCartByUserId = asyncHandler(async (req, res) => {
 try {
   const userCart = await Cart.aggregate([
     {
       $match: {
         user: req.user._id
       }
     },
     {
      $unwind: "$items"
     },
     {
      $lookup:{
        from: 'products',
        localField: 'items.product',
        foreignField: '_id',
        as: 'productDetails'
      }
     },
     {
      $unwind: {
        path: "$productDetails",
        preserveNullAndEmptyArrays: true 
      }
     },
     {
      $group:{
        _id: '$_id',
        items:{
          $push: {
            product: '$items.product',
              quantity: '$items.quantity',
              size: '$items.size',
              color: '$items.color',
            productDetails: '$productDetails'
          }
        },
        user: {$first: '$user'}
      }
     }
   ])
 
   return res
   .status(200)
   .json(
    new ApiResponse( 200, userCart, "fetched cart by user successfully")
   )
   
 } catch (error) {
  throw new ApiError(500, "could not fetch the cart")
 }

})

const deleteFromCart = asyncHandler( async (req, res) => {
  const {_id} = req.params

  if(!mongoose.Types.ObjectId.isValid(_id)){
    throw new ApiError(400, 'Invalid product ID');
  }

  console.log(_id)

  try {
    const deletedItem = await Cart.findOneAndUpdate(
      { "items.product": _id },
      { $pull: { items: { product: _id } } },
      { new: true }
    );

    if(!deletedItem){
      throw new ApiError(404, "Cart item not found")
    }
    
    return res
    .status(200)
    .json(
      new ApiResponse(200, deletedItem, "Item removed successfully")
    )
  } catch (error) {
    console.log("ERROR:", error)
    throw new ApiError( 500, "Internal server error")
  }
})

const updateCart = asyncHandler( async (req, res) => {
  const userId = req.user._id;
  const { product, quantity, size, color } = req.body;

  try {
    const cart = await Cart.findOne({ user: userId });

    if (!cart) {
      throw new ApiError(404, "Cart not found");
    }

    const productIndex = cart.items.findIndex(item => item.product.toString() === product);

    if (productIndex > -1) {
      cart.items[productIndex].quantity = quantity;
      cart.items[productIndex].size = size;
      cart.items[productIndex].color = color;
    } else {
      throw new ApiError(404, "Product not found in cart");
    }

    const updatedCart = await cart.save();

    if(!updatedCart){
      throw new ApiError(403, "Could not find the product")
    }

    return res
    .status(200)
    .json(
      new ApiResponse(200, updatedCart, "Item updated successfully")
    )
  } catch (error) {
    throw new ApiError(500, "Internal server error")
  }
})

const emptyCart = asyncHandler( async (req, res) => {
  const {_id} = req.params

  if(!mongoose.Types.ObjectId.isValid(_id)){
    throw new ApiError(400, 'Invalid product ID');
  }

  try {
    const emptyCart = await Cart.findOneAndDelete(_id)

    if(!emptyCart){
      throw new ApiError(404, "Cart not found")
    }

return res
    .status(200)
    .json(
      new ApiResponse(200, emptyCart, "Cart emptied successfully")
    )
  } catch (error) {
    console.log("ERROR:", error)
    throw new ApiError( 500, "Internal server error")
  }
})

export {
  addToCart,
  fetchCartByUserId,
  deleteFromCart,
  updateCart,
  emptyCart
}