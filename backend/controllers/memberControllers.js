import { getMemberFromDb , getMemberByIdFromDb , addMemberInDb , 
    updateMemberInDb , deleteMemberFromDb } from '../models/memberModels.js'


export const getMember = async (req , res , next) => {

    const allowedParams = ["search"]

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
        const members = await getMemberFromDb(req)

        res.status(200).json(members)
    }   
    catch (err) {
        next(err)
    }     
}
export const getMemberById = async (req , res , next) => {
    const { id } = req.params

    if (!/^[1-9]\d*$/.test(id)) {
            return res.status(400).json({
                message: "Invalid member ID"
            });
        }

    try {
        const member = await getMemberByIdFromDb(id)

        if (!member) {
            return res.status(404).json({
                message : `Member with id - ${id} not found in db`
            })
        }

        res.status(200).json(member)
    }
    catch (err) {
        next(err)
    }
}
export const addMember = async (req , res , next) => {

    if (!req.body) {
        return res.status(400).json({
            message : "Request body is required"
        })
    }
    const { userName , userEmail , phoneNumber } = req.body

    const requiredFields = { userName , userEmail , phoneNumber }

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


    // email validation
    if (typeof userEmail !== "string" || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userEmail.trim())) {
        return res.status(400).json({
            message: "Please provide a valid email address"
        })
    }

    // phone Number validation
    if ( typeof phoneNumber !== "string" || !/^[6-9]\d{9}$/.test(phoneNumber.trim())) {
        return res.status(400).json({
            message: "Phone number must be a valid 10-digit Indian mobile number"
        })
    }

    try {
        await addMemberInDb({userName , userEmail , phoneNumber})

        res.status(201).json({
            message : "Member added successfully"
        })
    }
    catch (err) {
        if (err.code === "ER_DUP_ENTRY") {
             return res.status(409).json({
                message : "A Member with this email already exists"
            })
        }
        next(err)
    }
}
export const updateMember = async (req , res , next) => {

    const { id } = req.params

    if (!/^[1-9]\d*$/.test(id)) {
            return res.status(400).json({
                message: "Invalid member ID"
            });
        }

    if (!req.body) {
        return res.status(400).json({
            message : "Request body is required"
        })
    }
    const { userName , userEmail , phoneNumber } = req.body

    const requiredFields = { userName , userEmail , phoneNumber }

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


    // email validation
    if (typeof userEmail !== "string" || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userEmail.trim())) {
        return res.status(400).json({
            message: "Please provide a valid email address"
        })
    }

    // phone Number validation
    if ( typeof phoneNumber !== "string" || !/^[6-9]\d{9}$/.test(phoneNumber.trim())) {
        return res.status(400).json({
            message: "Phone number must be a valid 10-digit Indian mobile number"
        })
    }

    try {
        const result = await updateMemberInDb(id , {userName , userEmail , phoneNumber})

        if (result.affectedRows === 0) {
            return res.status(404).json({
                message : `Member with id - ${id} not found`
            })
        }

        res.status(200).json({
            message : "Member updated successfully"
        })
    }
    catch (err) {
        if (err.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({
                message : "Email id already exists in the database"
            })
        }
        next(err)
    }
}
export const deleteMember = async (req , res , next) => {
    const { id } = req.params

    if (!/^[1-9]\d*$/.test(id)) {
            return res.status(400).json({
                message: "Invalid member ID"
            });
        }
    try {
        const result = await deleteMemberFromDb(id)

        if (result.affectedRows === 0) {
            return res.status(404).json({
                message : `Member with id - ${id} not found`
            })
        }

        res.status(200).json({
            message : "Member deleted successfully"
        })
    }
    catch (err) {

        if (err.code === "ER_ROW_IS_REFERENCED_2") {
            return res.status(409).json({
                message : "Cannot delete this member because issue record reference it"
            })
        }
        next(err)
    }
}