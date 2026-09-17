import mongoose from 'mongoose'
import { validateAmount, validateFieldIsEmpty } from '../utils/validations.js'
import Sale from '../sale/sale.model.js'
import Product from '../product/product.model.js'
import InventoryHistory from '../inventory-history/inventory-history.model.js'
import Inventory from '../inventory/inventory.model.js'

export const recordSale = async (req, res) => {
    const session = await mongoose.startSession()
    session.startTransaction()

    try {
        let data = req.body

        const { valid, field } = validateFieldIsEmpty(data, ['product', 'amount', 'total'])
        if (!valid) {
            await session.abortTransaction()
            return res.status(401).send({ message: `${field} is required` })
        }

        let inventory = await Inventory.findOne({ product: data.product })
        if (!inventory) {
            await session.abortTransaction()
            return res.status(404).send({ message: 'An error occurred while searching for the product in the inventory' })
        }

        if (!validateAmount(data.amount)) {
            await session.abortTransaction()
            return res.status(401).send({ message: 'The quantity must be greater than or equal to zero' })
        }

        if (data.amount > inventory.amount) {
            await session.abortTransaction()
            return res.status(409).send({ message: 'Insufficient stock' })
        }

        let product = await Product.findById(data.product)
        if (!product) {
            await session.abortTransaction()
            return res.status(404).send({ message: 'Product not found' })
        }

        data.total = data.amount * product.sellingPrice

        const sale = new Sale({ ...data, date: Date.now() })
        await sale.save({ session })

        inventory.amount -= data.amount
        await inventory.save({ session })

        let inventoryHistory = new InventoryHistory({
            movement: `Venta de Producto: ${product.name} - Cantidad: ${sale.amount}`,
            amount: sale.amount
        })
        await inventoryHistory.save({ session })

        await session.commitTransaction()

        return res.status(200).send({ message: 'The sale has been successfully saved' })
    } catch (error) {
        await session.abortTransaction()
        console.log(error)
        return res.status(500).send({ meesage: 'An error occurred. Try again' })
    } finally {
        session.endSession()
    }
}

export const getSales = async (req, res) => {
    try {
        let sales = await Sale.find()
            .populate('product')

        return res.status(200).send({ data: sales })
    } catch (error) {
        return res.status(500).send({ message: 'An error occurred. Please try again' })
    }
}