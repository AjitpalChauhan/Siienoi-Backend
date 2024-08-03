import mongoose, { Schema } from "mongoose";

const productSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  discountPercentage: {
    type: Number,
    required: true,
    max: 99
  },
  discountedPrice: {
    type: Number,
  },
  images:
  [
    {
    type: String,
    }
  ],
  videos:[
    {
    type: String,
    }
  ],
  thumbnail: {
    type: String,
    // required: true
  },
  rating: {
    type: Number,
    max: 5
  },
  category: {
    type: Schema.Types.ObjectId,
    ref: 'Category'
  },
  isFeatured: { 
    type: Boolean, 
    default: false 
  },
  isTrending: { 
    type: Boolean, 
    default: false 
  },
  newArrival: { 
    type: Boolean, 
    default: false 
  },
  stock: {
    type: Number,
    required: true
  },
  colors: [{
    type: String
  }]

}, {timestamps: true})

export const Product = mongoose.model('Product', productSchema)