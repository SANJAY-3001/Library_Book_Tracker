import express from "express"
import { getBookIssue, issueBook , getBookIssueById } from "../controllers/bookIssueControllers.js"

export const bookIssueRoutes = express.Router()

bookIssueRoutes.get(`/` , getBookIssue)
bookIssueRoutes.get(`/:id` , getBookIssueById)
bookIssueRoutes.post(`/` , issueBook)