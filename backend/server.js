import express from "express"

const app = express()
const PORT = 3001

app.use(express.static('../frontend'))

app.use('/api' , (req , res) => {
    res.status(200).json({
        success : true,
        message : "Library Book Tracker Backend is running..."
    })
})
app.use((req , res) => {
    res.status(404).json({
        success : false,
        message : "Endpoint is not found..."
    })
})


app.listen(PORT , () => console.log(`Server is running on port ${PORT}`))