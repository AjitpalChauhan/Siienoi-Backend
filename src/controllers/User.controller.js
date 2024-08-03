import { asyncHandler } from "../utils/AsyncHandler.js";
import {ApiError} from "../utils/ApiError.js";
import {User} from "../models/User.model.js";
import {ApiResponse} from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken"




// GENRATE TOKEN 
const generateAccessAndRefreshToken = async(userId) => {
try {
  const user =await User.findById(userId)
  const accessToken = user.generateAccessToken()
  const refreshToken = user.generateRefreshToken()

  user.refreshToken = refreshToken
  await user.save({validateBeforeSave: false})



  // console.log(accessToken, refreshToken) 
  return {accessToken, refreshToken}

} catch (error) {
  throw new ApiError(500, "Something went wrong while generating referesh and access token")
}
}





// REGISTRATION

const registerUser = asyncHandler( async (req, res) => {
  
// get user info
// check if empty data
// check if user exist
// create a user with db
// check for user created and remove password and refreshToken from the response
// send the response


const {username, email, password} = req.body

if(
  [username, email, password].some( (field) => field.trim() === "")
){
  throw new ApiError(400, "All feilds are required")
}

const existingUser = await User.findOne({
  $or:[{email}, {username}]
})

if(existingUser){
  throw new ApiError(409, "User already exists with this email or username")
}

const user = await User.create({
  username: username.toLowerCase(),
  email,
  password
})

const createdUser = await User.findById(user._id).select(
  "_id role"
)

if(!createdUser){
  throw new ApiError(500, "Something went wrong while registering the user")
}

return res.status(201).json(
  new ApiResponse(200, createdUser, "User registered Successfully")
)



})

// LOGIN
 
const loginUser = asyncHandler( async (req, res) => {
//receive data and retrive from req.body
// confirm if received
// if then find the user with the email
// confirm if there is any user
// use bcrypt and confirm if the password is correct
// if password correct create and send tokens into the cookies
// return json

const {email, password} = req.body;

console.log(email, password)

if(!email){
  throw new ApiError(400, "Please provide an email")
}

const user = await User.findOne({email})

if(!user){
  throw new ApiError(404, "User does not exist")
}

const isPasswordValid = await user.isPasswordCorrect(password)

if(!isPasswordValid){
  throw new ApiError(400, "Invalid user credentials")
}

const {accessToken, refreshToken} = await generateAccessAndRefreshToken(user._id)

// console.log(accessToken, refreshToken)

const loggedInUser = await User.findById(user._id).select("_id role")

const options = {
  httpOnly:true,
  secure: true,
  sameSite: 'Strict'
}

return res
.status(200)
.cookie("accessToken", accessToken, options)
.cookie("refreshToken", refreshToken, options)
.json(
  new ApiResponse(
    201,
    {
      user: loggedInUser, accessToken, refreshToken
    },
    "User logged In Successfully"
  )
)

})

//LOGOUT
const logoutUser = asyncHandler( async (req, res) => {
  await User.findByIdAndUpdate(
    req.user?._id,
    {
      $unset: {
        refreshToken: 1
      }
    },
    {
      new: true
    }
  )

  const options = {
    httpOnly: true,
    secure: true
  }

  return res
  .status(200)
  .clearCookie("accessToken", options)
  .clearCookie("refreshToken", options)
  .json(
    new ApiResponse(200, {}, "User logged Out")
  )
})


// REFRESHACCESSTOKEN
const refreshAccessToken = asyncHandler( async (req, res) => {

  console.log(req.user._id)
  
  const refreshToken = req.cookies?.refreshToken || req.body.refreshToken

  if(!refreshToken){
    throw new ApiError(401, "unauthorized request")
  }

 try {
   const decodedToken = await jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET)
 
   const user = await User.findById(decodedToken?._id)
 
   if(!user){
    throw new ApiError(401, "Invalid refresh token")
   }
 
   if(user.refreshToken !== refreshToken){
    throw new ApiError(401, "Refresh token is expired or used")
   }

   const options = {
    httpOnly: true,
    secure: true
  }
 
   const {accessToken,newRefreshToken} = await generateAccessAndRefreshToken(user._id)
 
   return res
   .status(200)
   .cookie("accessToken", accessToken, options)
   .cookie("refreshToken", newRefreshToken, options)
   .json(
    new ApiResponse(201, {
      accessToken, refreshToken: newRefreshToken
    }, 
    "Access token refreshed" 
  )
   )
 
 } catch (error) {
  throw new ApiError(401, error?.message || "Invalid refresh token")
 }

})

// GET CURRENT USER
const getCurrentUser = asyncHandler( async (req, res) => {
  const user = req.user
  return res
  .status(200)
  .json(
    new ApiResponse( 200, user, "User fetched successfully")
  )
})


// UPDATE USER
const updateAccountDetails = asyncHandler( async (req, res) => {
  const {username, gender, dob} = req.body

  const user = await User.findByIdAndUpdate(
    req.user?._id,
    {
      $set: {
        username,
        gender,
        dob
      }
    },
    {
      new: true
    }
  ).select("-password -refreshToken")

  return res
  .status(200)
  .json(
    new ApiResponse( 200, user, "Account details updated successfully")
  )

})




export {
  registerUser,
  loginUser,
  logoutUser,
  refreshAccessToken,
  getCurrentUser,
  updateAccountDetails
}