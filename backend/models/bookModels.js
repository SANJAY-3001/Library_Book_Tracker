import db from '../config/db.js'

export const getBookFromDb = async(req) => {
    let query = `SELECT * FROM Books WHERE 1 = 1`
    const queryArgs = []

    const queryParams = req.query

    const { title , author , isbn } = queryParams

    if (title) {
        query += ` AND book_name LIKE ?`
        queryArgs.push(`%${title}%`)
    }
    if (author) {
        query += ` AND author LIKE ?`
        queryArgs.push(`%${author}%`)
    }
    if (isbn) {
        query += ` AND isbn = ?`
        queryArgs.push(isbn)
    }

    const [rows] = await db.execute(query , queryArgs)

    return rows
}


export const getBookByIdFromDb = async(id) => {
    const query = `SELECT * FROM Books WHERE book_id = ?`
    const queryArgs = [id]

    const [rows] = await db.execute(query , queryArgs)

    return rows[0] || null
}


export const addBooksIntoDb = async (book) => {
    const connection = await db.getConnection()

    try {
        await connection.beginTransaction()

        const { bookName , author , isbn , totalCopies } = book

        const query = `INSERT INTO Books 
        (book_name , author , isbn , total_copies) values 
        (? , ? , ? , ?)`
        const queryArgs = [bookName , author , isbn , totalCopies]

        const res = await connection.execute(query , queryArgs)

        await connection.commit()

        console.log("Books added into DB")
    }
    catch (err) {
        await connection.rollback()
        console.error(`Failed to add a book ${err.message}`)
        throw err
    }
    finally {
        await connection.release()
    }
}


export const updateBookInDb = async (id , book) => {
    const { bookName , author , isbn , totalCopies } = book

    const query = `UPDATE Books SET book_name = ?,
    author = ? , isbn = ? , total_copies = ? WHERE book_id = ?`

    const queryArgs = [bookName , author , isbn , totalCopies , id]

    const [result] = await db.execute(query , queryArgs)

    return result
}


export const deleteBookInDb = async (id) => {
    const query = `DELETE FROM Books WHERE book_id = ?`
    const queryArgs = [id]

    const [result] = await db.execute(query , queryArgs)

    return result
}