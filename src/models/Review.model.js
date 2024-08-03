import mongoose, { Schema, Types } from "mongoose";

const reviewSchema = new Schema( {
  rating: {
    type: Number,
    required: true
  },
  comment: {
    type: String,
  },
  date: {
    type: Date, 
    default: Date.now 
  },
  images: [
    {
      type: String
    }
  ],
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  product: {
    type: Schema.Types.ObjectId,
    ref: "Product"
  }
})

export const Review = mongoose.model('Review', reviewSchema)