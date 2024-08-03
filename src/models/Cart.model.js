import mongoose, { Schema } from "mongoose";

const cartSchema = new Schema( {
    items: [
      {
        quantity: { 
        type : Number, 
        required: true,
        default: 1
        },
        product: { 
          type: Schema.Types.ObjectId, 
          ref: 'Product', 
          required: true
        },
        size: { 
          type : Schema.Types.Mixed
        },
        color: { 
          type : Schema.Types.Mixed
        }
      }
    ],
    user:{ 
      type: Schema.Types.ObjectId, 
      ref: 'User', 
      required: true
    }
} )

export const Cart = mongoose.model('Cart', cartSchema)