import Inventory from '../inventory/inventory.model.js'

export const getInventory = async (req, res) => {
    try {
        let inventory = await Inventory.find()
            .populate('product')

        return res.status(200).send({ data: inventory })
    } catch (error) {
        console.log(error)
        return res.status(500).send({ message: 'An error occurred. Try again' })
    }
}