import mongoose from 'mongoose'
import { validateAmount, validateFieldIsEmpty } from '../utils/validations.js'
import Product from './product.model.js'
import Inventory from '../inventory/inventory.model.js'
import InventoryHistory from '../inventory-history/inventory-history.model.js'

export const createProduct = async (req, res) => {
    const session = await mongoose.startSession()
    session.startTransaction()

    try {
        let data = req.body

        const { valid, field } = validateFieldIsEmpty(data, ['name', 'brand', 'sellingPrice', 'status']);
        if (!valid) {
            await session.abortTransaction()
            return res.status(400).send({ message: `${field} is required` })
        }

        if (!validateAmount(data.sellingPrice)) {
            await session.abortTransaction()
            return res.status(401).send({ message: 'The quantity must be greater than or equal to zero' })
        }

        let product = new Product(data)
        await product.save({ session })

        let productInventory = {
            product: product._id,
            amount: 0
        }

        let addProductInventory = new Inventory(productInventory)
        await addProductInventory.save({ session })

        let inventoryHistory = {
            movement: `Creación del Producto ${product._id} - ${product.name}`,
            amount: productInventory.amount,
            date: Date.now()
        }

        let addHistoryInventory = new InventoryHistory(inventoryHistory)
        await addHistoryInventory.save({ session })

        await session.commitTransaction()
        return res.status(201).send({ message: 'Successfully created' })
    } catch (error) {
        await session.abortTransaction()
        console.log(error)
        return res.status(500).send({ message: 'An error occurred. Try again' })
    } finally {
        session.endSession()
    }
}

export const updateProduct = async (req, res) => {
    const session = await mongoose.startSession()
    session.startTransaction()

    try {
        let data = req.body
        let { id } = req.params

        const { valid, field } = validateFieldIsEmpty(data, ['name', 'brand', 'sellingPrice', 'status'])
        if (!valid) {
            await session.abortTransaction()
            return res.status(400).send({ message: `${field} is required` })
        }

        if (!validateAmount(data.sellingPrice)) {
            await session.abortTransaction()
            return res.status(401).send({ message: 'The quantity must be greater than or equal to zero' })
        }

        let productEdit = await Product.findByIdAndUpdate(
            { _id: id },
            data,
            { new: true }
        )
        if (!productEdit) {
            await session.abortTransaction()
            return res.status(404).send({ message: 'The update failed. Please try again' })
        }

        let inventoryHistoryData = {
            movement: `Actualización del Producto ${productEdit._id} - ${productEdit.name} `,
            amount: 0
        }

        let inventoryHistory = new InventoryHistory(inventoryHistoryData)
        await inventoryHistory.save({ session })

        await session.commitTransaction()
        return res.status(200).send({ message: 'The update was successful' })
    } catch (error) {
        await session.abortTransaction()
        console.log(error)
        return res.status(500).send({ message: 'An error occurred. Try again' })
    } finally {
        session.endSession()
    }
}

export const deleteProduct = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction()

    try {
        let { id } = req.params

        if (!id) {
            await session.abortTransaction()
            return res.status(400).send({ message: 'Product ID is required' })
        }

        let productDel = await Product.findByIdAndDelete(id, { session })
        if (!productDel) {
            await session.abortTransaction()
            return res.status(404).send({ message: 'It could not be deleted. Please try again' })
        }

        let inventoryHistoryData = {
            movement: `Eliminación del Producto ${productDel._id} - ${productDel.name} `,
            amount: 0
        }

        let inventoryHistory = new InventoryHistory(inventoryHistoryData)
        await inventoryHistory.save({ session })

        await Inventory.deleteOne({ product: id }, { session })

        await session.commitTransaction()

        return res.status(204).send()
    } catch (error) {
        await session.abortTransaction()
        console.log(error)
        return res.status(500).send({ message: 'An error occurred. Try again' })
    } finally {
        session.endSession()
    }
}

export const getProducts = async (req, res) => {
    try {
        let products = await Product.find()

        return res.status(200).send({ data: products })
    } catch (error) {
        console.log(error)
        return res.status(500).send({ message: 'An error occurred. Try again' })
    }
}

export const getTotalProducts = async (req, res) => {
    try {
        let totalProducts = await Product.countDocuments()

        return res.status(200).send({ data: totalProducts })
    } catch (error) {
        console.log(error)
        return res.status(500).send({ message: 'An error occurred. Try again' })
    }
}