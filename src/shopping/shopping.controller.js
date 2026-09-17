import Shopping from './shopping.model.js'
import Product from '../product/product.model.js'
import Inventory from '../inventory/inventory.model.js'
import inventoryHistory from '../inventory-history/inventory-history.model.js'
import mongoose from 'mongoose'
import { validateAmount, validateFieldIsEmpty } from '../utils/validations.js'

export const addShopping = async (req, res) => {
    const session = await mongoose.startSession()
    session.startTransaction()

    try {
        let data = req.body

        const { valid, field } = validateFieldIsEmpty(data, ['product', 'amount', 'unitCost'])
        if (!valid) {
            await session.abortTransaction()
            return res.status(401).send({ message: `${field} is required` })
        }

        if (!validateAmount(data.amount)) {
            await session.abortTransaction()
            return res.status(401).send({ message: 'The quantity must be greater than or equal to zero' })
        }

        if (!validateAmount(data.unitCost)) {
            await session.abortTransaction()
            return res.status(401).send({ message: 'The unit price must be greater than or equal to zero' })
        }

        let product = await Product.findOne({ _id: data.product });
        if (!product) {
            await session.abortTransaction()
            return res.status(404).send({ message: 'Product not found' })
        }

        let shopping = new Shopping(data)
        await shopping.save({ session })

        let inventory = await Inventory.findOne({ product: data.product })
        if (!inventory) {
            await session.abortTransaction()
            return res.status(404).send({ message: 'Inventory not found' })
        }

        inventory.amount += data.amount
        await inventory.save({ session })

        let inventoryHistoryData = {
            movement: `Compra de producto: ${product.name}, cantidad: ${data.amount}`,
            amount: data.amount
        }

        let history = new inventoryHistory(inventoryHistoryData)
        await history.save({ session })

        await session.commitTransaction()

        return res.status(200).send({ message: 'Purchase saved successfully' })
    } catch (error) {
        await session.abortTransaction()
        console.log(error)
        return res.status(500).send({ message: 'An error occurred. Try again' })
    } finally {
        session.endSession()
    }
}

export const getShopping = async (req, res) => {
    try {
        let shopping = await Shopping.find()
            .populate('product')

        return res.status(200).send({ data: shopping })
    } catch (error) {
        return res.status(500).send({ message: 'An error occurred. Please try again' })
    }
}