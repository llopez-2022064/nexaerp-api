import { Router } from "express";
import { validateJwt } from '../middleware/validate-jwt.js'
import { checkPermission } from '../middleware/check-permission.js'
import { getInventory } from "./inventory.controller.js";

const api = new Router()

api.get('/', [validateJwt, checkPermission('inventory', 'view')], getInventory)

export default api