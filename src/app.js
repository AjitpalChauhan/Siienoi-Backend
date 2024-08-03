import express from 'express'
import cookieParser from 'cookie-parser'
import cors from 'cors'

const app = express()

app.use(cors({
  origin: process.env.CORS_ORIGIN,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'], 
  allowedHeaders: ['Content-Type', 'Authorization'], 
}))

app.use(express.json({limit: "16kb"}))
app.use(express.urlencoded({extended: true, limit: "16kb"}))
app.use(express.static("public"))
app.use(cookieParser())

//routes import
import userRouter from './routes/User.router.js'

import productRouter from "./routes/Product.routes.js"

import cartRouter from "./routes/Cart.routes.js"

import categoryRouter from "./routes/Category.routes.js"

import addressRouter from "./routes/Address.routes.js"

import reviewRouter from "./routes/Review.routes.js"

import orderRouter from "./routes/Order.routes.js"


//User routes

app.use("/api/v1/users", userRouter)

//Product routes

app.use("/api/v1/products", productRouter)

//Cart routes

app.use("/api/v1/cart", cartRouter)

//Catgory routes

app.use("/api/v1/category", categoryRouter)

//Address routes

app.use("/api/v1/address", addressRouter)

//Review routes

app.use("/api/v1/review", reviewRouter)

//Order routes

app.use("/api/v1/order", orderRouter)


export {app}