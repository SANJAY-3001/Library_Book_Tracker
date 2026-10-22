
const API_URL = `/api/members`

export const getMembers = async (filters = {}) => {
    const queryParams = new URLSearchParams()

    if (filters.search) {
        queryParams.append("search" , filters.search)
    }

    const url = queryParams.toString() 
        ? `${API_URL}?${queryParams.toString()}`
        : API_URL

    const response = await fetch(url , {
        method : "GET"
    })

    const data = await response.json()

    if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch members')
    }

    return data

}

export const getMemberById = async (id) => {
    const response = await fetch(`${API_URL}/${id}` , {
        method : "GET"
    })

    const data = await response.json()

    if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch member')
    }

    return data
} 

export const addMember = async (memberData) => {
    const response = await fetch(API_URL , {
        method : "POST",
        headers : {
            "Content-Type" : "application/json"
        },
        body : JSON.stringify(memberData)
    })

    const data = await response.json()

    if (!response.ok) {
        throw new Error(data.message || `Failed to post member`)
    }

    return data
}

export const updateMember = async (id , memberData) => {
    const response = await fetch(`${API_URL}/${id}` , {
        method : "PUT",
        headers : {
            "Content-Type" : "application/json"
        },
        body : JSON.stringify(memberData)
    })

    const data = await response.json()

    if (!response.ok) {
        throw new Error(data.message || `Failed to update member`)
    }

    return data
}

export const deleteMember = async (id) => {
    const response = await fetch(`${API_URL}/${id}` , {
        method : "DELETE"
    })

    const data = await response.json()

    if (!response.ok) {
        throw new Error(data.message || `Failed to delete member`)
    }

    return data
}