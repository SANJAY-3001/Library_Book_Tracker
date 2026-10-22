import db from "../config/db.js"
import { books , bookIssues , members } from "../data/data.js"

async function seedDatabase()
{
    const connection = await db.getConnection()
    try {
        await connection.beginTransaction()

        for (const book of books)
        {
            const { book_name , author , isbn , total_copies } = book
            const insertQuery = `INSERT INTO Books (book_name , author , isbn , total_copies)
            values (? , ? , ? , ?)`
            const queryArgs = [book_name , author , isbn , total_copies]

            await connection.execute(insertQuery , queryArgs)
        }

        console.log("Books Inserted Successfully...")

        for (const member of members)
        {
            const { user_name , phone_number , email } = member
            const insertQuery = `INSERT INTO Members (user_name , phone_number , email)
            values (? , ? , ?)`
            const queryArgs = [user_name , phone_number , email]

            await connection.execute(insertQuery , queryArgs)
        }

        console.log("Members Inserted Successfully")



        const [ bookRows ] = await connection.execute(`
            SELECT book_id , isbn FROM Books`)

        // console.log(`Book Rows ${bookRows}`)
        
        const bookIdMap = new Map(
            bookRows.map(book => [
                book.isbn,
                book.book_id
            ])
        )

        // console.log(`BookMapId ${bookIdMap}`)

        const [ memberRows ] = await connection.execute(`
            SELECT user_id , email FROM Members`)

        const memberIdMap = new Map(
            memberRows.filter(member => member.email !== null)
            .map(member => [member.email , member.user_id])
        )
        
        for (const bookIssue of bookIssues)
        {

            const bookId = bookIdMap.get(bookIssue.isbn)
            const userId = memberIdMap.get(bookIssue.email)

            if (bookId === undefined || userId === undefined) {
                throw new Error(
                    `Book or member not found for ISBN: ${bookIssue.isbn}, email: ${bookIssue.email}`
                );
            }
          
            const insertQuery = `INSERT INTO Book_Issues (book_id , user_id , issue_date
            , due_date , return_date , status)
            values (?, ?, ?, ?, ?, ?)`
            const queryArgs = [
                    bookId,
                    userId,
                    bookIssue.issue_date,
                    bookIssue.due_date,
                    bookIssue.return_date,
                    bookIssue.status
                ]

            await connection.execute(insertQuery , queryArgs)
        }

        await connection.commit()

        console.log("Book issues inserted successfully.");
        console.log("Database seeded successfully!");
    }
    catch (err) {
        await connection.rollback()
        console.error("Seeding failed:", err.message);
    }
    finally {
        connection.release()

        await db.end()
    }
}

seedDatabase()