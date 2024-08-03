import { Order } from "../models/Order.model.js";
import { Cart } from "../models/Cart.model.js";
import { asyncHandler } from "../utils/AsyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { Product } from "../models/Products.model.js";




const createOrder = asyncHandler(async (req, res) => {
  const  userId  = req.user._id; 

  try {
    

    const order = await Order.create({...req.body, user: userId})

    return res.status(201).json(new ApiResponse(201, order, "Order created successfully"));
  } catch (error) {
    console.error("Error creating order:", error);
    throw new ApiError(500, "Server error while creating order");
  }
});


const addProductFromCart = asyncHandler( async (req, res) => {
  const userId = req.user?._id
try {
  const cart = await Cart.findOne({user: userId}).populate("items.product")

  if (!cart) {
    throw new ApiError(404, "Cart not found");
  }

  const itemsFromCart = cart.items.map((item) => ({
    product: item.product,
    quantity: item.quantity,
    size: item.size,
    color: item.color
  }))

  if (!itemsFromCart) {
    throw new ApiError(404, "Items not found");
  }

  res
  .status(200)
  .json(
    new ApiResponse(200, itemsFromCart, "fetched items from cart")
  )

} catch (error) {
  console.log("ERROR:", error)
  throw new ApiError(500, "Internal server error could not fetched items from cart")
}


})

const DirectBuyOrder = asyncHandler( async (req, res) => {
  const {product, quantity, size, color} = req.body
  try {

    const productDetails = await Product.findById(product)
    
    const items ={
      productDetails, quantity: quantity || 1, size, color
    } 
     
    if (!items) {
      throw new ApiError(404, "Item not found");
    }
  
    res
    .status(200)
    .json(
      new ApiResponse(200, items, "fetched items successfully")
    )
  
  } catch (error) {
    console.log("ERROR:", error)
    throw new ApiError(500, "Internal server error could not fetched item")
  }
  
})


const updateOrder = asyncHandler( async (req, res) => {

  const userId = req.user._id
  const {orderId} = req.params
  const {status} = req.body
  
  try {
    console.log(orderId)
    const order = await Order.findById(orderId)
console.log(order)
    if(!order){
      throw new ApiError(404, 'Order not found')
    }

    // Check if user is the owner of the order or admin
    if(order.user.toString() !== userId.toString() && req.user.role !== 'admin'){
      throw new ApiError(403, 'You do not have permission to update this order')
    }

    // Users can only cancel if the order is not dispatched
    if(order.user.toString() === userId.toString() && status === 'Cancelled'){
      if(['Dispatched', 'Out for delivery', 'Delivered'].includes(order.orderStatus)){
        throw new ApiError(400, 'You cannot cancel an order that has been dispatched')
      }
    }

    if(req.user.role === 'admin'){
      if(["Order Confirmed",'Dispatched', "Out for delivery", "Delivered", "Returned", "Cancelled"].includes(status)){
        order.orderStatus = status
      }else{
        throw new ApiError(400, 'Invalid status update')
      }
    }else{
      if(status === 'Cancelled'){
        order.orderStatus = status
      }else{
        throw new ApiError(400, 'You can only cancel the order, no updates')
      }
    }

    order.history.push({
      updatedBy: userId,
      updatedAt: new Date(),
      orderStatus: status,
    });

    const updatedOrder = await order.save()

    res
    .status(200)
    .json(
      new ApiResponse(200, updatedOrder, 'Order updated successfully')
    )


  } catch (error) {
    console.log("ERROR:", error)
    throw new ApiError(500, "Internal server error, could not update the order")
  }

})

const fetchOrderByOrderNumber = asyncHandler( async (req, res) => {
  const {_id} = req.params
try {
  const order = await Order.findById(_id)
  res
  .status(200)
  .json(
    new ApiResponse(200, order, "Order fetched successfully")
  )
} catch (error) {
  console.log("ERROR:", error)
  throw new ApiError(500, "Internal server error could not fetched order")
}
})

const fetchAllOrders = asyncHandler( async (req, res) => {
  const {userId, paymentStatus, productId, orderStatus } = req.query;

  let query = {}

  if(userId){
    query.user = userId
  }
  if(paymentStatus){
    query['payment.paymentStatus'] = paymentStatus
  }
  if(productId){
    query['items.product'] = productId
  }
  if(orderStatus){
    query.orderStatus = orderStatus
  }

  try {
    
    const orders = await Order.find(query).populate("user").populate("address").populate("items.product")

    return res
    .status(200)
    .json(new ApiResponse(200, orders, "Orders fetched successfully"));
} catch (error) {
  console.error("Error fetching orders:", error);
  throw new ApiError(500, "Server error while fetching orders");
}


})

const deleteOrder = asyncHandler( async (req, res) => {
  const order = await Order.findById(req.params._id);

  if (!order) {
    return next(new ErrorHander("Order not found with this Id", 404));
  }

  await order.remove();

  res.status(200).json({
    success: true,
  });
})



export {
  createOrder,
  updateOrder,
  fetchAllOrders,
  fetchOrderByOrderNumber,
  deleteOrder,
  addProductFromCart,
  DirectBuyOrder
}