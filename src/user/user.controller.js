import User from '../user/user.model.js'
import { encrypt } from '../utils/encrypt.js'
import { validateFieldIsEmpty } from '../utils/validations.js'

export const updateUser = async (req, res) => {
    try {
        let data = req.body
        let { id } = req.params

        let { valid, field } = validateFieldIsEmpty(data, ['name', 'lastName', 'email', 'password', 'rol'])
        if (!valid) return res.status(400).send({ message: `${field} is required` })

        if (data.password) data.password = encrypt(data.password)

        let user = await User.findByIdAndUpdate(
            { _id: id },
            data,
            { new: true }
        ).select('-password')

        if (!user) return res.status(404).send({ message: 'The update failed. Please try again' })

        return res.status(200).send({ message: 'The update was successful' })
    } catch (error) {
        console.log(error);
        return res.status().send({ message: 'An error occurred. Try again' })
    }
}

export const deleteUser = async (req, res) => {
    try {
        let { id } = req.params

        if (!id) return res.status(400).send({ message: 'User ID is required' })

        let user = await User.findByIdAndDelete(id)
        if (!user) return res.status(404).send({ message: 'It could not be deleted. Please try again' })

        return res.status(204).send()
    } catch (error) {
        console.log(error)
        return res.status(500).send({ message: 'An error occurred. Please try again' })
    }
}

export const getProfile = async (req, res) => {
    try {
        let userId = req.user.id
        console.log(userId)

        let user = await User.findById(userId).select('-password')
        if (!user) return res.status(404).send({ message: 'Profile Not Found' })

        return res.status(200).send({ data: user })
    } catch (error) {
        console.log(error)
        return res.status(500).send({ message: 'An error occurred. Please try again' })
    }
}

export const getUsers = async (req, res) => {
    try {
        let users = await User.find()

        return res.status(200).send({ data: users })
    } catch (error) {
        console.error(error)
        return res.status(500).send({ message: 'An error occurred. Please try again' })
    }
}

export const getCountUser = async (req, res) => {
    try {
        let usersTotal = await User.countDocuments()

        return res.status(200).send({ data: usersTotal })
    } catch (error) {
        console.error(error)
        return res.status(500).send({ message: 'An error occurred. Please try again' })
    }
}