import mongoose from 'mongoose'
import { validateAmount, validateNonEmptyFields } from '../utils/validations.js'
import Product from './product.model.js'
import Inventory from '../inventory/inventory.model.js'
import InventoryHistory from '../inventory-history/inventory-history.model.js'

export const createProduct = async (req, res) => {
    const session = await mongoose.startSession()
    session.startTransaction()

    try {
        const data = req.body ?? {}
        const allowedFields = ['name', 'brand', 'sellingPrice']

        if (Object.keys(data).some((key) => !allowedFields.includes(key))) {
            await session.abortTransaction()
            return res.status(400).send({ message: 'Only name, brand and sellingPrice can be provided' })
        }

        const { isValid, emptyField } = validateNonEmptyFields(data, allowedFields)
        if (!isValid) {
            await session.abortTransaction()
            return res.status(400).send({ message: `${emptyField} is required` })
        }

        if (!validateAmount(data.sellingPrice)) {
            await session.abortTransaction()
            return res.status(401).send({ message: 'The quantity must be greater than or equal to zero' })
        }

        let product = new Product({
            name: data.name,
            brand: data.brand,
            sellingPrice: data.sellingPrice,
            status: true
        })
        await product.save({ session })

        let productInventory = {
            product: product._id,
            amount: 0
        }

        let addProductInventory = new Inventory(productInventory)
        await addProductInventory.save({ session })

        let inventoryHistory = {
            movement: `Producto creado: ${product.name} / Marca: ${product.brand}`,
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
        const data = req.body ?? {}
        const { id } = req.params
        const allowedFields = ['name', 'brand', 'sellingPrice']

        if (!mongoose.isObjectIdOrHexString(id)) {
            await session.abortTransaction()
            return res.status(400).send({ message: 'Invalid product ID' })
        }

        if (Object.keys(data).length === 0 ||
            Object.keys(data).some((key) => !allowedFields.includes(key))) {
            await session.abortTransaction()
            return res.status(400).send({ message: 'Provide only name, brand or sellingPrice to update' })
        }

        const { isValid, emptyField } = validateNonEmptyFields(
            data,
            allowedFields,
            { allowMissingFields: true }
        )
        if (!isValid) {
            await session.abortTransaction()
            return res.status(400).send({ message: `${emptyField} is required` })
        }

        if (Object.hasOwn(data, 'sellingPrice') && !validateAmount(data.sellingPrice)) {
            await session.abortTransaction()
            return res.status(400).send({ message: 'The price must be greater than or equal to zero' })
        }

        let productEdit = await Product.findOneAndUpdate(
            { _id: id, status: true },
            { $set: data },
            { new: true, runValidators: true, session }
        )
        if (!productEdit) {
            await session.abortTransaction()
            return res.status(404).send({ message: 'The update failed. Please try again' })
        }

        let inventoryHistoryData = {
            movement: `Producto actualizado: ${productEdit.name} / Marca: ${productEdit.brand}`,
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

        if (!mongoose.isObjectIdOrHexString(id)) {
            await session.abortTransaction()
            return res.status(400).send({ message: 'Invalid product ID' })
        }

        const inventory = await Inventory.findOne({ product: id }).session(session)
        if (!inventory) {
            await session.abortTransaction()
            return res.status(409).send({ message: 'Product inventory is missing' })
        }

        if (inventory.amount !== 0) {
            await session.abortTransaction()
            return res.status(409).send({ message: 'Cannot deactivate a product with stock' })
        }

        const productDel = await Product.findOneAndUpdate(
            { _id: id, status: true },
            { $set: { status: false } },
            { new: true, runValidators: true, session }
        )
        if (!productDel) {
            await session.abortTransaction()
            return res.status(404).send({ message: 'It could not be deleted. Please try again' })
        }

        let inventoryHistoryData = {
            movement: `Producto desactivado: ${productDel.name} / Marca: ${productDel.brand}`,
            amount: 0
        }

        let inventoryHistory = new InventoryHistory(inventoryHistoryData)
        await inventoryHistory.save({ session })

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
        const products = await Product.find({ status: true })
            .sort({ createdAt: -1, _id: -1 })

        return res.status(200).send({ data: products })
    } catch (error) {
        console.log(error)
        return res.status(500).send({ message: 'An error occurred. Try again' })
    }
}

export const getTotalProducts = async (req, res) => {
    try {
        const totalProducts = await Product.countDocuments({ status: true })

        return res.status(200).send({ data: totalProducts })
    } catch (error) {
        console.log(error)
        return res.status(500).send({ message: 'An error occurred. Try again' })
    }
}