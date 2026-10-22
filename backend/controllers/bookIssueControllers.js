import { getBookIssueByIdFromDb, getBookIssueFromDb, issueBookInDb } from "../models/bookIssueModels.js"


export const getBookIssue = async(req , res , next) => {

    const allowedParams = ["status"]
    
    const invalidParams = Object.keys(req.query)
            .filter(param => !allowedParams.includes(param))
    
    if (invalidParams.length > 0) {
        return res.status(400).json({
            message : "Invalid query parameter",
            invalidParams,
            allowedParams
        })
    }
    try {
        const result = await getBookIssueFromDb(req)

        res.status(200).json(result)
    }
    catch (err) {
        next(err)
    }
}
export const getBookIssueById = async(req , res , next) => {
    const { id } = req.params

    if (!/^[1-9]\d*$/.test(id)) {
            return res.status(400).json({
                message: "Invalid issue ID"
            });
    }

    try {
        const result = await getBookIssueByIdFromDb(id)

        if (!result) {
            return res.status(404).json({
                message : `No book issued having id - ${id}`
            })
        }

        res.status(200).json(result)
    }
    catch (err) {
        next(err)
    }
}



export const issueBook = async(req , res , next) => {
    if (!req.body) {
        return res.status(400).json({
            message : "Request body is required"
        })
    }
    const { bookId , userId , issueDate , dueDate } = req.body

    const requiredFields = { bookId , userId , issueDate , dueDate }

    const missingFields = Object.entries(requiredFields)
                        .filter(([key , value]) => {
                            return value === null || value === undefined || 
                            (typeof value === "string" && value.trim() === "")
                        })
                        .map(([key]) => key)

    if (missingFields.length > 0){
        return res.status(400).json({
            message : "Required Fields are missing",
            missingFields
        })
    }

    if (!/^[1-9]\d*$/.test(userId)) {
            return res.status(400).json({
                message: "Invalid member ID"
            });
    }

    if (!/^[1-9]\d*$/.test(bookId)) {
            return res.status(400).json({
                message: "Invalid book ID"
            });
    }

    // Issue date validation

    if (
        typeof issueDate !== "string" ||
        !/^\d{4}-\d{2}-\d{2}$/.test(issueDate.trim()) ||
        isNaN(Date.parse(issueDate)) ||
        new Date(issueDate).toISOString().slice(0, 10) !== issueDate.trim()) {
        return res.status(400).json({
            message: "Please provide a valid issue date in YYYY-MM-DD format"
        });
    }

    // Due date validation

    if (
        typeof dueDate !== "string" ||
        !/^\d{4}-\d{2}-\d{2}$/.test(dueDate.trim()) ||
        isNaN(Date.parse(dueDate)) ||
        new Date(dueDate).toISOString().slice(0, 10) !== dueDate.trim()) {
            return res.status(400).json({
                message: "Please provide a valid due date in YYYY-MM-DD format"
            });
    }

    if (new Date(dueDate) < new Date(issueDate)) {
        return res.status(400).json({
            message: "Due date cannot be earlier than issue date"
        });
    }

    try {
        const result = await issueBookInDb({bookId , userId , issueDate , dueDate})

        res.status(201).json({
            message : `Book issued succesfully`
        })
    }
    catch (err) {
        next(err)
    }
}