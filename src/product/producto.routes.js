import { Router } from "express";
import { validateJwt } from '../middleware/validate-jwt.js'
import { isAdmin, isOperational, isTechnician } from '../middleware/validate-rol.js'
import { checkPermission } from '../middleware/check-permission.js'
import { createProduct, deleteProduct, getProducts, getTotalProducts, updateProduct } from "./product.controller.js";

const api = Router()

api.get('/', [validateJwt, checkPermission('products', 'view')], getProducts)
api.get('/total-products', [validateJwt, checkPermission('products', 'view')], getTotalProducts)
api.post('/', [validateJwt, checkPermission('products', 'create')], createProduct)
api.patch('/:id', [validateJwt, checkPermission('products', 'edit')], updateProduct)
api.delete('/:id', [validateJwt, checkPermission('products', 'delete')], deleteProduct)

export default api