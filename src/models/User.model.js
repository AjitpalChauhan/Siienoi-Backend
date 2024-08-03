import mongoose, { Schema } from "mongoose";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken'

const userSchema = new Schema( {
  username: {
    type: String,
    required: true,
    unique: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    requried: true
  },
  orders: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Order'
    }
  ],
  cart: {
    type: Schema.Types.ObjectId,
    ref: 'Cart'
  },
  addresses: [
    {
      type: Schema.Types.ObjectId,
    ref: 'Address'
    }
  ], 
  // paymentInformation: [
  //   {
  //       type: mongoose.Schema.Types.ObjectId,
  //       ref: "payment_information",
  //   },
  // ],
  dob: {
    type: Date
  },
  gender: {
    type: String
  },
  refreshToken: {
    type: String
  },
  role:{
    type:String,
    default: 'user'
  }

}, {timestamps: true})



//
userSchema.pre('save', async function(next){

  if(!this.isModified("password")) return next()

  this.password = await bcrypt.hash(this.password, 10)
  next()
})

//
userSchema.methods.isPasswordCorrect = async function(password){
  return await bcrypt.compare(password, this.password)
}

//
userSchema.methods.generateAccessToken = function(){
  return jwt.sign(
    {
    _id: this._id,
    username: this.username,
    email: this.email
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY
    }

  )
}

//
userSchema.methods.generateRefreshToken = function(){
  return jwt.sign(
    {
    _id: this._id,
    username: this.username,
    email: this.email
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY
    }

  )
}



export const User = mongoose.model('User', userSchema)