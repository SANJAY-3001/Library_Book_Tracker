import db from '../config/db.js'

export const getMemberFromDb = async (req) => {
    let query = `SELECT 
                m.user_id,
                m.user_name,
                m.phone_number,
                m.email,
                m.created_at,
                COUNT(bi.user_id) as book_issued 
                FROM Members m LEFT JOIN Book_issues bi 
                ON m.user_id = bi.user_id 
                WHERE 1 = 1
                `
    const queryArgs = []


    const { search } = req.query

    if (search) {
        query += ` AND (
            m.user_name LIKE ? OR
            m.email LIKE ?
        )`

        const searchValue = `%${search}%`
        queryArgs.push(searchValue , searchValue)
    }

    query += ` GROUP BY
        m.user_id,
        m.user_name,
        m.phone_number,
        m.email,
        m.created_at
    `
    const [rows] = await db.execute(query , queryArgs)

    return rows
}


export const getMemberByIdFromDb = async (id) => {
    let query = `SELECT 
                m.user_id,
                m.user_name,
                m.phone_number,
                m.email,
                m.created_at,
                COUNT(bi.user_id) as book_issued 
                FROM Members m LEFT JOIN Book_issues bi 
                ON m.user_id = bi.user_id 
                WHERE m.user_id = ?
                GROUP BY
                m.user_id,
                m.user_name,
                m.phone_number,
                m.email,
                m.created_at
                `
    const queryArgs = [id]

    const [rows] = await db.execute(query , queryArgs)

    return rows[0] || null
}

export const addMemberInDb = async (memberData) => {
    const { userName , userEmail , phoneNumber } = memberData

    const query = `INSERT INTO Members (user_name , email , phone_number)
                    VALUES (? , ? , ?)`
    const queryArgs = [userName , userEmail , phoneNumber]

    await db.execute(query , queryArgs)
}

export const updateMemberInDb = async (id , memberData) => {
    const { userName , userEmail , phoneNumber } = memberData
    const query = `UPDATE Members SET
                   user_name = ?,
                   email = ?,
                   phone_number = ?
                   WHERE user_id = ?`
    const queryArgs = [userName , userEmail , phoneNumber , id]

    const [rows] = await db.execute(query , queryArgs)

    return rows
}

export const deleteMemberFromDb = async (id) => {
    const query = `DELETE FROM Members WHERE user_id = ?`
    const queryArgs = [id]

    const [rows] = await db.execute(query , queryArgs)

    return rows
}