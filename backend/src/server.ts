import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import morgan from "morgan"
import path from "path"


dotenv.config()

const app = express()
const PORT = 3001
app.use(express.json())
app.use(morgan("combined"))
// Start server
app.listen(PORT, () => {
  console.log(`Server chạy tại http://localhost:${PORT}`)
})