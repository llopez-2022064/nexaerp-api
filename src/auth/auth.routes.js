import { Router } from "express";
import { createUser, login } from './auth.controller.js'
import { validateJwt } from "../middleware/validate-jwt.js";
import { isAdmin } from "../middleware/validate-rol.js";

const api = Router();

api.post('/sign-up', [validateJwt, isAdmin], createUser);
api.post('/sign-in', login);

export default api