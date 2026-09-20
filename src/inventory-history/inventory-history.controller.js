import inventoryHistoryModel from "./inventory-history.model.js";

export const getHistory = async (req, res) => {
    try {
        let history = await inventoryHistoryModel.find()
            .sort({ createdAt: -1 })

        return res.status(200).send({ data: history })
    } catch (error) {
        console.error(error);
        return res.status(500).send({ message: 'An error occurred. Try again' })
    }
}

export const getMovementToday = async (req, res) => {
    try {
        const start = new Date()
        start.setHours(0, 0, 0, 0)

        const end = new Date()
        end.setHours(24, 0, 0, 0)

        const movementsToday = await inventoryHistoryModel.countDocuments({
            createdAt: {
                $gte: start,
                $lt: end
            }
        })

        return res.status(200).send({ data: movementsToday })
    } catch (error) {
        console.error(error);
        return res.status(500).send({ message: 'An error occurred. Try again' })
    }
}