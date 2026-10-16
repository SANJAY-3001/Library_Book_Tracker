
export const errorHandler = (err , req , res , next) => {
    // Handle invalid JSON from express.json()
    if (err.type === "entity.parse.failed") {
        return res.status(400).json({
            success: false,
            message: "Invalid JSON in request body. Please check your JSON syntax."
        });
    }
    
    console.error(err)

    const statusCode = err.statusCode || 500

    res.status(500).json({
        message : statusCode == 500 
        ? "Internal Server Error"
        : err.message
    })
}