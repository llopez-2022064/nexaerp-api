import { Router } from "express";
import { deleteUser, getCountUser, getProfile, getUsers, updateUser } from "./user.controller.js";
import { validateJwt } from "../middleware/validate-jwt.js";
import { isAdmin } from "../middleware/validate-rol.js";

const api = Router()

api.get('/', [validateJwt, isAdmin], getUsers)
api.get('/total-users', [validateJwt, isAdmin], getCountUser)
api.get('/profile', [validateJwt, isAdmin], getProfile)
api.patch('/:id', [validateJwt, isAdmin], updateUser)
api.delete('/:id', [validateJwt, isAdmin], deleteUser)

export default api