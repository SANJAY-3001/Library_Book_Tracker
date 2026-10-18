const API_URL = "/api/books"


export const getAllBooks = async(filters = {}) => {

    const queryParams = new URLSearchParams()

    // if (filters.title) {
    //     queryParams.append("title" , filters.title)
    // }

    // if (filters.author) {
    //     queryParams.append("author" , filters.author)
    // }

    // if (filters.isbn) {
    //     queryParams.append("isbn" , filters.isbn)
    // }

    if (filters.search) {
        queryParams.append("search" , filters.search)
    }

    if (filters.availability) {
        queryParams.append("availability" , filters.availability)
    }

    console.log(queryParams)

    const url = queryParams.toString() ? `${API_URL}?${queryParams.toString()}` : API_URL

    const response = await fetch(url , {
        method : "GET"
    })

    if (!response.ok) {
        const errData = await response.json()

        throw new Error(errData.message || "Failed to fetch book")
    }

    const books = await response.json()

    return books
}

export const getBookById = async(id) => {
    const response = await fetch(`${API_URL}/${id}` , {
        method : "GET"
    })

    if (!response.ok) 
    {
        const errData = await response.json()

        throw new Error(errData.message || "Failed to fetch book")
    }

    const book = await response.json()

    return book
}

export const createBook = async(bookData) => {
    const response = await fetch(API_URL , {
        method : "POST",
        headers : {
            "Content-Type" : "application/json"
        },
        body : JSON.stringify(bookData)
    })

    if (!response.ok) {
        const errData = await response.json()

        throw new Error(errData.message || "Failed to add book")
    }

    const data = await response.json()

    return data
}


export const updateBook = async(bookData , id) => {
    const response = await fetch(`${API_URL}/${id}` , {
        method : "PUT",
        headers : {
            "Content-Type" : "application/json"
        },
        body : JSON.stringify(bookData)
    })

    if (!response.ok) {
        const errData = await response.json()

        throw new Error(errData.message || "Failed to update book")
    }

    const data = await response.json()

    return data
}

export const deleteBook = async (id) => {
    const response = await fetch(`${API_URL}/${id}` , {
        method : "DELETE"
    })

    if (!response.ok) {
        const errData = await response.json()

        throw new Error(errData.message || "Failed to delete the book")
    }

    const data = await response.json()

    return data
}