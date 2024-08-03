import ConnectionDB from "./db/index.js";
import { app } from "./app.js";
import dotenv from "dotenv";

dotenv.config({
  path: './.env'
})


ConnectionDB()
.then(
  app.listen(process.env.PORT || 8000, () => {
    console.log(`Server is running at ${process.env.PORT}`)
  })
)
.catch((error) =>
  console.log('Connection Error', error)
)
