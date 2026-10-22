const API_URL = `/api/book-issues`

export const getBookIssue = async (filters = {}) => {
    const queryParams = new URLSearchParams()

    if (filters.status) {
        queryParams.append("status" , filters.status)
    }

    const url = queryParams.toString() 
        ? `${API_URL}?${queryParams.toString()}`
        : API_URL

    const response = await fetch(url , {
        method : "GET"
    })

    const data = await response.json()

    if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch book issues')
    }

    return data

}

export const getBookIssueById = async (id) => {
    const response = await fetch(`${API_URL}/${id}` , {
        method : "GET"
    })

    const data = await response.json()

    if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch book issue')
    }

    return data
} 

export const issueBook = async (bookIssueData) => {
    const response = await fetch(API_URL , {
        method : "POST",
        headers : {
            "Content-Type" : "application/json"
        },
        body : JSON.stringify(bookIssueData)
    })

    const data = await response.json()

    if (!response.ok) {
        throw new Error(data.message || `Failed to issue a book`)
    }

    return data
}