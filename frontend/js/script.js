import { getAllBooks } from './api/bookApi.js'
import { renderTotalNoBooks , renderBooks } from './ui/bookUi.js'
import { setupBookEvents } from './events/bookEvents.js'
import { totalNoBooks , booksTableBody } from './dom/bookDom.js'


let books = []

// Initailize
async function start() {
    try {
        await Promise.all([
            loadBooks()
        ])
    }
    catch (err) {
        console.log("Failed to initialize " + err.message)
    }
}


// Books
async function loadBooks() {
    books = await getAllBooks()
        
        
    renderBooks(books , booksTableBody)
    renderTotalNoBooks(books.length , totalNoBooks)
}

async function applyBookFilters(search = "" , availability = "") {
    try {
        const filteredBooks = await getAllBooks({search , availability})

        renderBooks(filteredBooks , booksTableBody)
    }
    catch(err) {
        console.log("Failed to search books " + err.message)
    }
}

setupBookEvents(applyBookFilters , loadBooks)


// Members




// Books issues



start()
