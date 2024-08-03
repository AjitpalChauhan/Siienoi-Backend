    import mongoose, { Schema } from "mongoose";

    const orderSchema = new Schema({
      user: {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
      address: {
        type: Schema.Types.ObjectId,
        ref: "Address",
      },
      payment: [
        {
          paymentId: {
            type: String,
            required: true,
          },
          paymentMode: {
            type: String,
            required: true,
            enum: ["COD", "Card", "NetBanking", "UPI"],
          },
          paymentStatus: {
            type: String,
            default: "pending",
            enum: ["pending", "Success", "failed"],
          },
          transactionId: {
            type: String,
          },
        },
      ],
      totalAmount: {
        type: Number,
        required: true,
      },
      totalItems: {
        type: Number,
        required: true,
      },
      orderStatus: {
        type: String,
        default: "Order Confirmed",
        enum: ["Order Confirmed",'Dispatched', "Out for delivery", "Delivered", "Returned", "Cancelled"],
      },
      items: [
        {
          product: {
            type: Schema.Types.ObjectId,
            ref: "Product",
            required: true,
          },
          quantity: {
            type: Number,
            required: true,
          },
          size: String,
          color: String,
        },
      ],
      discount: {
        type: Number,
        default: 0,
      },
      couponCode: {
        type: String,
      },
      shipping: {
        carrier: String,
        trackingNumber: String,
      },
      taxPrice: {
        type: Number,
        required: true,
        default: 0,
      },
      shippingPrice: {
        type: Number,
        required: true,
        default: 0,
      },
      customerNote: {
        type: String,
      },
      date: {
        type: Date,
        default: Date.now,
      },
      history: [{
        updatedBy: {
          type: Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        updatedAt: {
          type: Date,
          required: true,
        },
        orderStatus: {
          type: String,
          required: true,
        },
      }]
    });

    export const Order = mongoose.model("Order", orderSchema);
