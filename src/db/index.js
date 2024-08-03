import mongoose from "mongoose";

const ConnectionDB = async () => {
  try {
    const connectionInstance = await mongoose.connect(process.env.MONGODB_URI)
    console.log(`\n MongoDB connected !! DB HOST: ${connectionInstance.connection.host}`)
  } catch (error) {
    console.log('Connection to DB failed', error)
    process.exit(1)
  }
}

export default ConnectionDB