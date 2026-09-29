import { Router } from "express";
import { getReportPDFSales, getReportPDFShopping, getReportPDFHistory, getReportPDFInventory } from "./reports.controller.js";
import { validateJwt } from '../middleware/validate-jwt.js'
import { checkPermission } from '../middleware/check-permission.js'

const api = Router()

api.use(validateJwt)
api.post('/pdf/sales', checkPermission('sales', 'view'), getReportPDFSales)
api.post('/pdf/shopping', checkPermission('shopping', 'view'), getReportPDFShopping)
api.post('/pdf/history', checkPermission('inventoryHistory', 'view'), getReportPDFHistory)
api.post('/pdf/inventory', checkPermission('inventory', 'view'), getReportPDFInventory)

export default api
