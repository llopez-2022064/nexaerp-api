import { Router } from "express";
import { validateJwt } from "../middleware/validate-jwt.js";
import { addShopping, getShopping } from "./shopping.controller.js";
import { checkPermission } from "../middleware/check-permission.js";

const api = Router()

api.get('/', [validateJwt, checkPermission('shopping', 'view')], getShopping)
api.post('/', [validateJwt, checkPermission('shopping', 'create')], addShopping)

export default api