import app from "./app.js"
import { connectDB } from "./bd.js"
import dotenv from "dotenv"

dotenv.config()
connectDB()
app.listen(3000)
console.log("Server is running on port 3000")