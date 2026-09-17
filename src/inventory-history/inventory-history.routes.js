import { Router } from "express";
import { validateJwt } from '../middleware/validate-jwt.js'
import { checkPermission } from '../middleware/check-permission.js'
import { getHistory, getMovementToday } from "./inventory-history.controller.js";

const api = new Router()

api.get('/', [validateJwt, checkPermission('inventoryHistory', 'view')], getHistory)
api.get('/total-movements', [validateJwt, checkPermission('inventoryHistory', 'view')], getMovementToday)

export default api