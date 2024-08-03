import { Product } from "../models/Products.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/AsyncHandler.js";
import { deleteOnCloudinary, updateOnCloudinary, uploadOnCloudinary } from "../utils/Cloudinary.js";
import mongoose from "mongoose";

const addProduct = asyncHandler( async (req, res) => {

  //get information from req
  //multer for images and video in localpath
  //upload to the cloudinary
  //remove from the local server
  //save the product
  //response for success


  try {
    const product = new Product(req.body)
    console.log(product)
    console.log(req.files)
    console.log(req.files.images)
    console.log(req.files.videos)
    console.log(req.files.thumbnail)


    let imagesLocalPath = []
    let videosLocalPath = []
    let thumbnailLocalPath = '';

    if (req.files) {
          if(Array.isArray(req.files.images) && req.files.images.length > 0){
            imagesLocalPath = req.files.images.map((image) => image.path)
          }
          if(Array.isArray(req.files.videos) && req.files.videos.length > 0){
            videosLocalPath = req.files.videos.map((video) => video.path)
          }
          if(req.files.thumbnail && req.files.thumbnail.length > 0){
            thumbnailLocalPath = req.files.thumbnail[0].path;
          }
        }

        console.log(imagesLocalPath)
        console.log(videosLocalPath)
        console.log(thumbnailLocalPath)



      const images = await uploadOnCloudinary(imagesLocalPath)
      const videos = await uploadOnCloudinary(videosLocalPath)
      const thumbnail = await uploadOnCloudinary([thumbnailLocalPath])

      console.log(images, videos, thumbnail)

    const discountedPrice = Math.round(product.price*(1-product.discountPercentage/100))

    console.log(discountedPrice)

    console.log(images)

    product.images = images;
    product.videos = videos;
    product.thumbnail = thumbnail.length > 0 ? thumbnail[0] : '';
    product.discountedPrice = discountedPrice

    console.log(product)

    const savedProduct = await product.save()
      res.status(200).json(
        new ApiResponse(200, savedProduct, "Product added successfully")
      )



  } catch (error) {
    console.log('ERROR:', error)
    throw new ApiError(500, "could not add the product", error)
  }



  // try {
  //   const product = new Product(req.body)
  //   console.log(product)
  
  //   product.discountedPrice = Math.round(product.price*(1-product.discountPercentage/100))
  
  //   console.log(product.discountedPrice)
    

  //   console.log(req.files)

  //   let imagesLocalPath = [];
  //   let videosLocalPath = [];
  //   let thumbnailLocalPath = [];


  //   if (req.files) {
  //     if(Array.isArray(req.files.images) && req.files.images.length > 0){
  //       imagesLocalPath = req.files.images.map((image) => image.path)
  //     }
  //     if(Array.isArray(req.files.videos) && req.files.videos.length > 0){
  //       videosLocalPath = req.files.videos.map((video) => video.path)
  //     }
  //     if(Array.isArray(req.files.thumbnail) && req.files.thumbnail.length > 0){
  //       thumbnailLocalPath = req.files.thumbnail.map((thumbnail) => thumbnail.path);
  //     }
      
  //   }
    
    
    

  //   console.log(imagesLocalPath,videosLocalPath,thumbnailLocalPath)
    
  
  //   const [imagesdata, videosdata, thumbnaildata] = await Promise.all([
  //     uploadOnCloudinary(imagesLocalPath),
  //     uploadOnCloudinary(videosLocalPath),
  //     uploadOnCloudinary(thumbnailLocalPath)
  //   ]);

  //   if(!thumbnaildata){
  //     throw new ApiError(400, "Thumbnail is required")
  //   }

  //   // create an array of url of cloudinary data
  //   const imageURL = imagesdata?.map((image) => image.url)
  //   const videoURL = videosdata?.map((video) => video.url) || [];
  //   const thumbnailURL = thumbnaildata?.map((thumbnail) => thumbnail.url)

  //   console.log(thumbnailURL)



  //   // Assign uploaded URLs to product object
  //   product.images = imageURL;
  //   product.videos = videoURL;
  //   product.thumbnail = thumbnailURL;

  // console.log(product)
  
  //   try{
  //     const savedProduct = await product.save()
  //     res.status(200).json(
  //       new ApiResponse(200, savedProduct, "Product added successfully")
  //     )
  //   } catch {
  //     throw new ApiError(500, "Something went wrong while saving the product")
  //   }
  // } catch (error) {
  //   console.error("Error adding product:", error);
  //   // Return error response
  //   throw new ApiError(500, "could not add the product")
  // }

}
)

const fetchAllProducts = asyncHandler( async (req, res) => {
 try {
   const products = await Product.find()
   if (products.length === 0) {
     return res.status(404).json(new ApiResponse(404, [], "No products found"));
   }
   return res
   .status(200)
   .json(
     new ApiResponse(
       200,
       products,
       "fetched all products"
     )
   )
 } catch (error) {
  console.log("ERROR:", error)
  throw new ApiError(500, "could not fetch the products")
 }
})

const viewProductDetails = asyncHandler( async (req, res) => {
  const { _id } = req.params

  console.log(_id)

  try {
    const productDetails = await Product.findById(_id)

    if(!productDetails){
      throw new ApiError(403, "This product does not exist")
    }

    return res
    .status(200)
    .json(
      new ApiResponse(200, productDetails, "Product fetched successfully")
    )
  } catch (error) {
    console.log("ERROR:",error)
    throw new ApiError(500, "Error while fetching the product")
  }

})

const updateProductDetails = asyncHandler( async (req, res) => {
  const {_id} = req.params
  const imagesUpdated = req.body.imagesUpdated === 'true' 
  const videosUpdated = req.body.videosUpdated === 'true' 
  const thumbnailUpdated = req.body.thumbnailUpdated === 'true' 
  
  try {
  const product = await Product.findById(_id)
  
  if(!product){
    throw new ApiError( 403, "Product not found")
  }

  Object.assign(product, req.body)

  if(imagesUpdated){
    let newImagesLocalPath = []
    if(Array.isArray(req.files.images) && req.files.images.length > 0){
      newImagesLocalPath = req.files.images.map(file => file.path)
    }
    const newImages = await updateOnCloudinary(product.images, newImagesLocalPath)
    product.images = newImages
  }


  if(videosUpdated){
    let newVideosLocalPath = []
    if(Array.isArray(req.files.videos) && req.files.videos.length > 0){
      newVideosLocalPath = req.files.videos.map(file => file.path)
    }
    const newVideos = await updateOnCloudinary(product.videos, newVideosLocalPath)
    product.videos = newVideos
  }


  if(thumbnailUpdated){
    let newThumbnailLocalPath = []
    if(Array.isArray(req.files.thumbnail) && req.files.thumbnail.length > 0){
      newThumbnailLocalPath = req.files.thumbnail.map(file => file.path)
    }
    const newThumbnail = await updateOnCloudinary(product.thumbnail, newThumbnailLocalPath)
    product.thumbnail = newThumbnail
  }

  if (req.body.discountPercentage || req.body.price) {
    const discountPercentage = req.body.discountPercentage || product.discountPercentage;
    const price = req.body.price || product.price;
    product.discountedPrice = price - (price * (discountPercentage / 100));
  }


    const savedproduct = await product.save()
    return res
    .status(200)
    .json(
      new ApiResponse(200, savedproduct, "Product updated successfully")
    )
} catch (error) {
  console.log("ERROR:", error)
  throw new ApiError(500, "Unable to process the request, internal server error")
}
})

const deleteProduct = asyncHandler(async (req, res) => {
  const { _id } = req.params;

  try {
    const product = await Product.findById(_id);
    if (!product) {
      throw new ApiError(404, "Product not found");
    }

    // Delete files from Cloudinary
    const imageDeletions = deleteOnCloudinary(product.images)
    const videoDeletions = deleteOnCloudinary(product.videos)
    const thumbnailDeletion = deleteOnCloudinary(product.thumbnail)

    console.log(imageDeletions,videoDeletions,thumbnailDeletion)

    const deletedProduct = await Product.deleteOne(product._id)
    
    res.status(200).json(
      new ApiResponse(200, deletedProduct, "Product deleted successfully")
    );
  } catch (error) {
    console.log("ERROR:", error)
    throw new ApiError(500, "could not delete the product");
  }
});


const fetchProductByCategory = asyncHandler( async (req, res) => {
  const { category } = req.query;

  try {
    const products = await Product.aggregate([
      {
        $lookup: {
          from: 'categories',
          localField: 'category',
          foreignField: '_id',
          as: 'categoryDetails'
        }
      },
      {
        $unwind: '$categoryDetails'
      },
      {
        $match: {
          'categoryDetails.name' : category
        }
      }
    ]) 

    console.log("Products:", products);

    if (products.length === 0) {
      throw new ApiError(404, "No products found for this category");
    }

    return res
    .status(200)
    .json(
      new ApiResponse(200, products, "Product fetched successfully based on category")
    )

  } catch (error) {
    console.error("Error fetching products by category:", error);
    throw new ApiError(500, "Server error cannot fetch the products")
  }
})


const sortProducts = asyncHandler(async (req, res) => {
  const { order } = req.params; 

  console.log(order)
  let sortOrder = 1; 
  if (order === 'desc') {
    sortOrder = -1; 
  }
  console.log(sortOrder)

  try {
    const products = await Product.aggregate([
      {
        $sort: {
          price: sortOrder
        }
      }
    ]);

    if (products.length === 0) {
      throw new ApiError(404, "No products found");
    }

    return res
      .status(200)
      .json(
        new ApiResponse(200, products, `Products sorted by price ${order === 'desc' ? 'high to low' : 'low to high'}`)
      );

  } catch (error) {
    console.error("Error sorting products by price:", error); 
    throw new ApiError(500, "Server error, cannot sort the products");
  }
});




export {
  addProduct,
  fetchAllProducts,
  fetchProductByCategory,
  sortProducts,
  deleteProduct,
  viewProductDetails,
  updateProductDetails
}
