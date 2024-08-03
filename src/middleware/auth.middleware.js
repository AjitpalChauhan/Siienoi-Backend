import { User } from "../models/User.model.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/AsyncHandler.js";
import jwt from "jsonwebtoken"


export const verifyJwt = asyncHandler( async (req, res, next) => {
  try {

    console.log('Cookies:', req.cookies.accessToken); // Log cookies
    console.log('Authorization Header:', req.header("Authorization")); 

    const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "")
    const refreshToken = req.cookies?.refreshToken
    console.log("refresh",refreshToken)

  //   const tokenFromHeader = req.headers.authorization?.split(" ")[1];
  // const tokenFromCookie = req.cookies?.accessToken;
  
  // Prefer token from header over token from cookie
  // const token = tokenFromHeader || tokenFromCookie;


    if(!token){
      throw new ApiError(401, "Unauthorized request")
    }

    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)

    const user = await User.findById(decodedToken?._id).select("-password -refreshToken")

    if(!user){
      throw new ApiError(401, "Invalid Access Token")
    }

    req.user = user
    next()



  } catch (error) {
    throw new ApiError(401, error?.message || "Invalid access token")
  }
})

export const isAdmin = (req, res, next) => {
  if(req.user.role !== 'admin'){
    throw new ApiError(403, 'Access denied')
  }
  next()
}