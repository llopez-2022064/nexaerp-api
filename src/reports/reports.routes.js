import { Router } from "express";
import { getReportPDFSales, getReportPDFShopping, getReportPDFHistory, getReportPDFInventory, getReportExcelSales, getReportExcelShopping, getReportExcelHistory, getReportExcelInventory } from "./reports.controller.js";
import { validateJwt } from '../middleware/validate-jwt.js'
import { checkPermission } from '../middleware/check-permission.js'

const api = Router()

api.use(validateJwt)
api.post('/pdf/sales', checkPermission('sales', 'view'), getReportPDFSales)
api.post('/pdf/shopping', checkPermission('shopping', 'view'), getReportPDFShopping)
api.post('/pdf/history', checkPermission('inventoryHistory', 'view'), getReportPDFHistory)
api.post('/pdf/inventory', checkPermission('inventory', 'view'), getReportPDFInventory)

api.post('/excel/sales', checkPermission('sales', 'view'), getReportExcelSales)
api.post('/excel/shopping', checkPermission('shopping', 'view'), getReportExcelShopping)
api.post('/excel/history', checkPermission('inventoryHistory', 'view'), getReportExcelHistory)
api.post('/excel/inventory', checkPermission('inventory', 'view'), getReportExcelInventory)

export default api
