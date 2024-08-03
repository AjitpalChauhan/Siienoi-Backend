import mongoose, { Schema } from "mongoose";

const addressSchema = new Schema( {
  country: {
    type: String,
    required: true
  },
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  line1: { 
    type: String,
    required: true
  },
  landmark: { 
    type: String,
    required: true
  },
  city: { 
    type: String,
    required: true
  },
  state: { 
    type: String,
    required: true
  },
  pincode: { 
    type: String,
    required: true
  },
  mobile: {
    type: String,
  },
  user: { type: Schema.Types.ObjectId, ref: 'User' }
} )

export const Address = mongoose.model('Address', addressSchema)







