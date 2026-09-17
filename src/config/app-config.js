import cors from 'cors'
import express from 'express'
import helmet from "helmet";
import morgan from 'morgan'

import { config } from "dotenv";
config()

import authRoutes from '../auth/auth.routes.js'
import usersRoutes from '../user/user.routes.js'
import productsRoutes from '../product/producto.routes.js'
import inventoryHistoryRoutes from '../inventory-history/inventory-history.routes.js'
import inventoryRoutes from '../inventory/inventory.routes.js';
import salesRoutes from '../sale/sale.routes.js'
import shoppingRoutes from '../shopping/shopping.routes.js'

const app = express()
const port = process.env.PORT || 3000

app.use(helmet())
app.use(cors())
app.use(morgan('dev'))
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

const BASE_URL = '/api/v1'

app.use(`${BASE_URL}/auth`, authRoutes)
app.use(`${BASE_URL}/users`, usersRoutes)
app.use(`${BASE_URL}/products`, productsRoutes)
app.use(`${BASE_URL}/inventory`, inventoryRoutes)
app.use(`${BASE_URL}/inventory/history`, inventoryHistoryRoutes)
app.use(`${BASE_URL}/sales`, salesRoutes)
app.use(`${BASE_URL}/shopping`, shoppingRoutes)

export const startServer = () => {
    app.listen(port, () => {
        console.log(`Running in port ${port}`)
    })
}
