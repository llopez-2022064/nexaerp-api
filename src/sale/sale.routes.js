import { Router } from "express";
import { checkPermission } from '../middleware/check-permission.js'
import { validateJwt } from "../middleware/validate-jwt.js";
import { getSales, recordSale } from "./sale.controller.js";

const api = Router()

api.get('/', [validateJwt, checkPermission('sales', 'view')], getSales)
api.post('/', [validateJwt, checkPermission('sales', 'create')], recordSale)

export default api