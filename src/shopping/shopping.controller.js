import Shopping from './shopping.model.js'
import Product from '../product/product.model.js'
import Inventory from '../inventory/inventory.model.js'
import inventoryHistory from '../inventory-history/inventory-history.model.js'
import mongoose from 'mongoose'
import { validateAmount, validateNonEmptyFields } from '../utils/validations.js'

export const addShopping = async (req, res) => {
    const session = await mongoose.startSession()
    session.startTransaction()

    try {
        let data = req.body

        const { isValid, emptyField } = validateNonEmptyFields(
            data,
            ['product', 'amount', 'unitCost']
        )
        if (!isValid) {
            await session.abortTransaction()
            return res.status(401).send({ message: `${emptyField} is required` })
        }

        if (!validateAmount(data.amount)) {
            await session.abortTransaction()
            return res.status(401).send({ message: 'The quantity must be greater than or equal to zero' })
        }

        if (!validateAmount(data.unitCost)) {
            await session.abortTransaction()
            return res.status(401).send({ message: 'The unit price must be greater than or equal to zero' })
        }

        let product = await Product.findOne({ _id: data.product, status: true }).session(session)
        if (!product) {
            await session.abortTransaction()
            return res.status(404).send({ message: 'Product not found or inactive' })
        }

        let shopping = new Shopping(data)
        await shopping.save({ session })

        let inventory = await Inventory.findOne({ product: data.product }).session(session)
        if (!inventory) {
            await session.abortTransaction()
            return res.status(404).send({ message: 'Inventory not found' })
        }

        inventory.amount += Number(data.amount)
        await inventory.save({ session })

        let inventoryHistoryData = {
            movement: `Compra: ${product.name} / Marca: ${product.brand}`,
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
            .sort({ createdAt: -1 })
            .populate('product')

        return res.status(200).send({ data: shopping })
    } catch (error) {
        return res.status(500).send({ message: 'An error occurred. Please try again' })
    }
}