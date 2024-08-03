import {Address} from "../models/Address.model.js";
import { asyncHandler } from "../utils/AsyncHandler.js";
import {ApiResponse} from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import mongoose from "mongoose";




const addAddress = asyncHandler( async (req, res) => {

  if (!req.user || !req.user._id) {
    throw new ApiError(401, "User not authenticated");
  }

  try {
    const address = new Address(
      {
        ...req.body, 
        user: req.user._id
      }
    )

    if(!address){
      throw new ApiError(400,"Could not save address")
    }

    const savedAddress = await address.save()
    return res
    .status(200)
    .json(
      new ApiResponse(200, savedAddress, "Address saved successfully")
    )
  } catch (error) {
    console.log("ERROR:",error)
    throw new ApiError(500, "Could not save the address")
  }
})



const updateAddress = asyncHandler( async (req, res) => {
const {_id} = req.params

if (!mongoose.Types.ObjectId.isValid(_id)) {
  throw new ApiError(400, 'Invalid address ID');
}

try {
  const updatedAddress = await Address.findByIdAndUpdate({_id, user: req.user._id}, req.body, {
    new: true,
    runValidators: true 
  })

  return res
  .status(200)
  .json(
    new ApiResponse( 200, updatedAddress, "Address updated successfully")
  )

} catch (error) {
  throw new ApiError( 500, "Could not update the address")
}
})



const deleteAddress = asyncHandler( async (req, res) => {
  const {_id} = req.params

  if (!mongoose.Types.ObjectId.isValid(_id)) {
    throw new ApiError(400, 'Invalid address ID');
  }

  try {
    const deletedAddress = await Address.findByIdAndDelete({ _id, user: req.user._id})

    if (!deletedAddress) {
      throw new ApiError(404, 'Address not found or you are not authorized to delete this address');
    }

    return res
    .status(200)
    .json(
      new ApiResponse( 200, deletedAddress, "Address deleted successfully")
    )
  } catch (error) {
    throw new ApiError(500, "Could not delete the address")
  }
})



const fetchAddressesByUser = asyncHandler( async (req, res) => {
try {
  
    const addresses = await Address.aggregate([
      {
        $match: {
          user: req.user._id
        }
      }
    ])
  
    return res
    .status(200)
    .json(
      new ApiResponse(200, addresses, "Addresses fetched by user Id successfully")
    )
    
} catch (error) {
  throw new ApiError(500, "Could not find the addresses")
}


})


const fetchAddressById = asyncHandler( async (req, res) => {
  const {_id} = req.params
  try {
    if(!mongoose.Types.ObjectId.isValid(_id)){
      throw new ApiError(404, "Invalid address query")
    }
    const address = await Address.findById(_id)

    if(!address){
      throw new ApiError(404, "Address does not exist")
    }

    return res
    .status(200)
    .json(
      new ApiResponse(200, address, "Address fetched successfully")
    )
    
  } catch (error) {
    console.log("could not fetch address", error)
    throw new ApiError(500, "Internal server error could npot find the address")
  }
})

export {
  addAddress,
  updateAddress,
  deleteAddress,
  fetchAddressesByUser,
  fetchAddressById
}

