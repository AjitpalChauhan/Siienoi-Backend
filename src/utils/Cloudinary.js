import {v2 as cloudinary} from 'cloudinary';
import fs from 'fs'
import { ApiError } from './ApiError.js';
import { asyncHandler } from './AsyncHandler.js';
          
cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET 
});

const uploadOnCloudinary = async (localFilePaths) => {

  try {

    if (!Array.isArray(localFilePaths)) {
      localFilePaths = [localFilePaths];
    }

    const uploadPromise = localFilePaths.map((path) => {
      return cloudinary.uploader.upload(path, {resource_type: 'auto'})
    })
    console.log(uploadPromise)
    const uploadResponse = await Promise.all(uploadPromise)
    console.log(uploadResponse)
    const urls = uploadResponse.map((response) => (response.secure_url))
    console.log(urls)
    
    localFilePaths.forEach((path) => {
      if (typeof path === 'string' && path.length > 0) {
        fs.unlinkSync(path);
      }
    });

    console.log("Successfully uploaded and deleted local files");
    return urls
  } catch (error) {
    localFilePaths.forEach((path) => {
      if (typeof path === 'string' && path.length > 0) {
        try {
          fs.unlinkSync(path);
        } catch (unlinkError) {
          console.error("Error deleting local file:", unlinkError);
        }
      }
    });
    throw new ApiError(500, "Could not upload the images on Cloudinary");
  }








  // try {

  //   if(!localFilePaths || localFilePaths.length === 0) return [];

  //   const filePathsArray = Array.isArray(localFilePaths) ? localFilePaths : [localFilePaths];

  //   const uploadPromise = filePathsArray.map(async (localFilePath) => {
  //     const response = await cloudinary.uploader.upload(localFilePath,
  //       { resource_type: "auto" })
  //       console.log("successfully uploaded",response.url)
  //       fs.unlinkSync(localFilePath)
  //       return response
  //   })
    
  //   const response = await Promise.all(uploadPromise)
  //   return response;

  // } catch (error) {

  //   localFilePaths.forEach((localFilePath) => {
  //     try {
  //       fs.unlinkSync(localFilePath);
  //       console.log("Deleted local file:", localFilePath);
  //     } catch (unlinkError) {
  //       console.error("Error deleting local file:", unlinkError);
  //     }
  //   });
  //   return [];
  // }
}

const updateOnCloudinary = async (oldArray, newLocalFilePath) => {

  try {
    const deletePromise = oldArray.map(
      (file) => {
        return cloudinary.uploader.destroy(file, { resource_type: 'auto' })
      }
    )
    await Promise.all(deletePromise)

    const uploadPromise = newLocalFilePath.map((path) => {
      return cloudinary.uploader.upload(path, {resource_type: 'auto'})
    })
    console.log(uploadPromise)
    const uploadResponse = await Promise.all(uploadPromise)
    console.log(uploadResponse)
    const urls = await uploadResponse.map((response) => (response.secure_url))
    console.log(urls)
    newLocalFilePath.forEach((path) => {
      fs.unlinkSync(path);
    });

    console.log("Successfully uploaded and deleted local files");
    return urls

  } catch (error) {
    newLocalFilePath.forEach((path) => {
      fs.unlinkSync(path);
    });
    throw new ApiError(500, "Could not upload the images on cloudinary")
  }
}


// delete from cloudinary

const deleteOnCloudinary = async (imagesArray) => {
  try {
    const deletePromise = imagesArray.map( (img) => cloudinary.uploader.destroy(img, { resource_type: 'auto' }) ) 

    console.log(deletePromise)

    const deletedImages = await Promise.all(deletePromise)

    console.log(deletedImages, "Images were successfully deleted from cloudinary");

    return deletedImages
    
  } catch (error) {
    throw new ApiError(500, "Could not delete the images on cloudinary")
  }
}

export {
  uploadOnCloudinary,
  updateOnCloudinary,
  deleteOnCloudinary
}
