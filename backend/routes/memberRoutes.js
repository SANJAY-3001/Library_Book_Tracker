import express from "express"
import { getMember , getMemberById , addMember , updateMember , deleteMember } from "../controllers/memberControllers.js"

export const memberRoutes = express.Router()

memberRoutes.get(`/` , getMember)
memberRoutes.get(`/:id` , getMemberById)
memberRoutes.post(`/`, addMember)
memberRoutes.put(`/:id` , updateMember)
memberRoutes.delete(`/:id` , deleteMember)