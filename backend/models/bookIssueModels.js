import db from '../config/db.js'

export const getBookIssueFromDb = async (req) => {
    let query = `
    SELECT bi.issue_id , bi.user_id , bi.book_id , b.book_name ,
    m.user_name , bi.issue_date , bi.due_date , bi.return_date ,
    CASE
        WHEN bi.status = 'returned' THEN 'returned'
        WHEN bi.due_date < CURDATE() THEN 'overdue'
        ELSE 'issued'
    END as issue_status
    FROM Book_Issues bi 
    JOIN Books b ON bi.book_id = b.book_id
    JOIN Members m ON bi.user_id = m.user_id
    `
    const queryArgs = []

    const { status } = req.query

    if (status === 'returned') {
        query += ` WHERE bi.status = ?`
        queryArgs.push('returned')
    }
    else if (status === 'overdue') {
        query += ` WHERE bi.status = ? AND bi.due_date < CURDATE()`
        queryArgs.push('issued')
    }
    else if (status === 'issued') {
        query += ` WHERE bi.status = ? AND bi.due_date >= CURDATE()`
        queryArgs.push('issued')
    }

    query += ` ORDER BY bi.issue_date DESC`

    const [rows] = await db.execute(query , queryArgs)

    return rows
}

export const getBookIssueByIdFromDb = async (id) => {
    const query = `
    SELECT bi.issue_id , bi.user_id , bi.book_id , b.book_name ,
    m.user_name , bi.issue_date , bi.due_date , bi.return_date ,
    CASE
        WHEN bi.status = 'returned' THEN 'returned'
        WHEN bi.due_date < CURDATE() THEN 'overdue'
        ELSE 'issued'
    END as issue_status
    FROM Book_Issues bi 
    JOIN Books b ON bi.book_id = b.book_id
    JOIN Members m ON bi.user_id = m.user_id
    WHERE bi.issue_id = ?
    `
    const queryArgs = [id]

    const [rows] = await db.execute(query , queryArgs)
    
    return rows[0] || null
}

export const issueBookInDb = async (bookIssueData) => {
    const { bookId , userId , issueDate , dueDate } = bookIssueData
    const query = `INSERT INTO Book_Issues (book_id , user_id , issue_date , due_date)
    values (? , ? , ? , ?)`
    const queryArgs = [bookId , userId , issueDate , dueDate]

    const [rows] = await db.execute(query , queryArgs)

    return rows
}
