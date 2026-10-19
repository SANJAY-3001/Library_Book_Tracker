import express from "express"
import { getBook , getBookById , addBook , updateBook , deleteBook} 
from "../controllers/bookControllers.js"


export const bookRoutes = express.Router()

bookRoutes.get(`/` , getBook)
bookRoutes.get(`/:id` , getBookById)
bookRoutes.post(`/` , addBook)
bookRoutes.put('/:id' , updateBook)
bookRoutes.delete('/:id' , deleteBook)