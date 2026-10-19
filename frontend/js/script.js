import { getAllBooks } from './api/bookApi.js'
import { renderTotalNoBooks , renderBooks } from './ui/bookUi.js'
import { setupBookEvents } from './events/bookEvents.js'
import { totalNoBooks , booksTableBody } from './dom/bookDom.js'
import { getMembers } from './api/memberApi.js'
import { membersTableBody, totalNoMembers } from './dom/memberDom.js'
import { renderMembers , renderTotalNoMembers } from './ui/memberUi.js'
import { setupMemberEvents } from './events/memberEvent.js'


// Initailize
async function start() {
    try {
        await Promise.all([
            loadBooks(),
            loadMembers()
        ])
    }
    catch (err) {
        console.log("Failed to initialize " + err.message)
    }
}


// Books

let books = []
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
let members = []

async function loadMembers() {
    members = await getMembers()

    renderMembers(members , membersTableBody)
    renderTotalNoMembers(members.length , totalNoMembers)
}

async function applyMemberFilters(search = "") {
    try {
        const filteredMembers = await getMembers({search})

        renderMembers(filteredMembers , membersTableBody)
    }
    catch (err) {
        console.log("Failed to search members " + err.message)
    }
}

setupMemberEvents(applyMemberFilters , loadMembers)


// Books issues



start()
