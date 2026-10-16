import express from "express"
import { getBook , getBookById , addBook , updateBook , deleteBook} 
from "../controllers/bookControllers.js"


export const bookRoutes = express.Router()

bookRoutes.get(`/books` , getBook)
bookRoutes.get(`/books/:id` , getBookById)
bookRoutes.post(`/books` , addBook)
bookRoutes.put('/books/:id' , updateBook)
bookRoutes.delete('/books/:id' , deleteBook)