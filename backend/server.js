import express from "express"
import "dotenv/config"
import { bookRoutes } from "./routes/bookRoutes.js"
import { errorHandler } from "./middlewares/errorMiddleware.js"

const app = express()
const PORT = process.env.PORT

app.use(express.static('../frontend'))
app.use(express.json())

app.use('/api' , bookRoutes)


app.use((req , res) => {
    res.status(404).json({
        success : false,
        message : "Endpoint is not found..."
    })
})


app.use(errorHandler)


app.listen(PORT , () => console.log(`Server is running on port ${PORT}`))