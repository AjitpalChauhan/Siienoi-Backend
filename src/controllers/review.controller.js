import mongoose from "mongoose";
import {Review} from "../models/Review.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/AsyncHandler.js";
import { deleteOnCloudinary, updateOnCloudinary, uploadOnCloudinary } from "../utils/Cloudinary.js";

const createReview = asyncHandler( async (req, res) => {

  const { productId } = req.params;
  const userId = req.user._id;

  const review = await new Review( {...req.body, user: userId, product: productId} )


  try {
    let reviewImages = []
    if(req.files && Array.isArray(req.files.images) && req.files.images.length > 0){
      reviewImages = req.files.images.map((image) => (image.path))
    }
  
    console.log(reviewImages)
  
    const images = await uploadOnCloudinary(reviewImages)
  
    if(!images){
      throw new ApiError(500, "Could not upload Images")
    }
  
    review.images = images;
  
    await review.save()
  
    return res
    .status(200)
    .json(
      new ApiResponse(200, review, "Review added successfully")
    )
  } catch (error) {
    throw new ApiError( 500, "Could not upload review, server error")
  }

  /* 
  1. collect info from req.body, req.user, req.files, req.params (rating,comment, user, images, product)
  2. upload the images on cloudinary
  3. save the link in the images and 
  4. use Review.create and create a review
  5. return res
  */
  
})

const editReview = asyncHandler( async (req, res) => {

  const {reviewId} = req.params
  const imagesUpdated = req.body.imagesUpdated === 'true' 

  try {
    const review = await Review.findById(reviewId)

    if (!review) {
      throw new ApiError(404, "Review not found");
    }
  
    Object.assign(review, req.body)
  
    if(imagesUpdated){
      let newImagesLocalPath = []
      if(req.files && Array.isArray(req.files.images) && req.files.images.length > 0){
        newImagesLocalPath = req.files.images.map((image) => (image.path))
      }
      const newImagesUrl = await updateOnCloudinary(review.images, newImagesLocalPath) 
      review.images = newImagesUrl
    }
  
    const updatedReview = await review.save();
  
    return res
    .status(200)
    .json(
      new ApiResponse(
        200, updatedReview, "Review updated successfully"
      )
    )
  } catch (error) {
    console.error("Error updating review:", error);
    throw new ApiError(500, "Could not update review, server error")
  }

})

const deleteReview = asyncHandler( async (req, res) => {
 const {reviewId} = req.params

 try {
  const review = await Review.findById(reviewId)

  if(!review){
    throw new ApiError(404, "Review not found")
  }

  // delete Images uploaded in cloudinary

  const imageDeletions = await deleteOnCloudinary(review.images)

  await review.remove();
    res.status(200).json(
      new ApiResponse(200, review, "Review deleted successfully")
    );

 } catch (error) {
  console.log("Error while deleting review:", error)
  throw new ApiError(500, "Could not delete the review, Server error")
 }

})

const fetchReviewByUserId = asyncHandler( async (req, res) => {
  const user = req.user
try {

  if (!user) {
    throw new ApiError(401, "Unauthorized access");
  }

  const review = await Review.find({user: user._id})

  if(review.length === '0'){
    return res
    .status(404)
    .json(
      new ApiResponse(404, [], "No reviews found for this user")
    )
  }

  return res
  .status(200)
  .json(
    new ApiResponse(200, review, "Review fetched successfully")
  )
} catch (error) {
  console.log("Error while finding review for this user",error)
  throw new ApiError( 500, " Could not find the reviews, server error ")
}
})

const fetchReviewByProductId = asyncHandler( async (req, res) => {
const {productId} = req.params
try {
  if (!productId || !mongoose.Types.ObjectId.isValid(productId)) {
    throw new ApiError(401, "Incorrect Product ID");
  }

  const review = await Review.find({product: productId})

  if( review.length === '0'){
    return res
    .status(404)
    .json(
      new ApiResponse(404, [], "No reviews found for this product")
    )
  }

  return res
  .status(200)
  .json(
    new ApiResponse(200, review, "Review fetched successfully")
  )

} catch (error) {
  console.log("Error while finding review for this product",error)
  throw new ApiError( 500, " Could not find the reviews, server error ")
}
})

export {
  createReview,
  editReview,
  deleteReview,
  fetchReviewByProductId,
  fetchReviewByUserId
}