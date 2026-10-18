import { getBookFromDb , getBookByIdFromDb , addBooksIntoDb ,
     updateBookInDb , deleteBookInDb } from "../models/bookModels.js"


export const getBook = async(req , res , next) => {

    const allowedParams = ["title" , "author" , "isbn" , "search" , "availability"]
    
    const invalidParams = Object.keys(req.query)
            .filter(param => !allowedParams.includes(param))
    
    if (invalidParams.length > 0) {
        return res.status(400).json({
            message : "Invalid query parameter",
            invalidParams,
            allowedParams
        })
    }

    try {
        const books = await getBookFromDb(req)

        res.status(200).json(books)
    }
    catch (err) {
        next(err)
    }
}


export const getBookById = async (req , res , next) => {
    try {
        const { id }= req.params


        if (!/^[1-9]\d*$/.test(id)) {
            return res.status(400).json({
                message: "Invalid book ID"
            });
        }

        const book = await getBookByIdFromDb(id)

        if (!book) {
            return res.status(404).json({
                message : "Book not found"
            })
        }

        res.status(200).json(book)
    }
    catch(err) {
        next(err)
    }
}


export const addBook = async (req , res , next) => {

    if (!req.body) {
        return res.status(400).json({
            message : "Request body is required"
        })
    }

    const { bookName , author , isbn , totalCopies } = req.body

    const requiredFields = {bookName , author , isbn , totalCopies}

    const missingFields = Object.entries(requiredFields)
            .filter(([key , value]) => {
                return value == undefined || value == null ||
                (typeof value === "string" && value.trim() === "")
            })
            .map(([key]) => key)

    if (missingFields.length > 0){
        return res.status(400).json({
            message : "Required Fields are missing",
            missingFields
        })
    }

    if (!Number.isInteger(totalCopies) || Number(totalCopies) < 1) {
        return res.status(400).json({
            message : "totalCopies must be positive integer"
        })
    }

    try {
        await addBooksIntoDb({bookName , author , isbn , totalCopies : Number(totalCopies)})

        res.status(201).json({
            message : "Books Added Succesfully",
        })
    }
    catch (err) {
        if (err.code === "ER_DUP_ENTRY") {
            return res.status(409).json({
                message : "A book with this isbn already exists"
            })
        }

        next(err)
    }
}


export const updateBook = async (req , res , next) => {
    const { id } = req.params

    if (!req.body) {
        return res.status(400).json({
            message : "Request body is required"
        })
    }

    const { bookName , author , isbn , totalCopies } = req.body

    const requiredFields = { bookName , author , isbn , totalCopies}

    const missingFields = Object.entries(requiredFields)
                .filter(([key , value]) => {
                    return value === undefined || value == null ||
                    (typeof value === "string" && value.trim() === "")
                })
                .map(([key]) => key)

    if (!/^[1-9]\d*$/.test(id)) {
        return res.status(400).json({
            message: "Invalid book ID"
        });
    }

    if (missingFields.length > 0) {
        return res.status(400).json({
            message : "Required Fields are missing",
            missingFields
        })
    }

    if (!Number.isInteger(totalCopies) || Number(totalCopies) < 1) {
        return res.status(400).json({
            message : "totalCopies must be positive integer"
        })
    }

    try {
        const result = await updateBookInDb(Number(id) , 
        {bookName , author , isbn , totalCopies : Number(totalCopies)})

        console.log(result)

        if (result.affectedRows === 0) {
            return res.status(404).json({
                message : "Book not found"
            })
        }

        res.status(200).json({
            message : "Books updated succesfully"
        })
    }
    catch (err) {

        if (err.code === "ER_DUP_ENTRY") {
            return res.status(409).json({
                message : "A book with this ISBN already exists"
            })
        }

        next(err)
    }
}

export const deleteBook = async (req , res , next) => {
    const { id } = req.params 

    if (!/^[1-9]\d*$/.test(id)) {
        return res.status(400).json({
            message: "Invalid book ID"
        });
    }

    try {
        const result = await deleteBookInDb(Number(id))

        console.log(result)

        if (result.affectedRows === 0) {
            return res.status(404).json({
                message : "Book not found"
            })
        }

        res.status(200).json({
            message : "Book deleted Successfully"
        })
    }
    catch (err) {

        if (err.code === "ER_ROW_IS_REFERENCED_2") {
            return res.status(409).json({
                message: "Cannot delete this book because issue records reference it"
            });
        }

        next(err)
    }
}