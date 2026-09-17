import User from '../user/user.model.js'
import { validatePassword, encrypt } from '../utils/encrypt.js'
import { generateToken } from '../utils/generate-token.js'
import { validateFieldIsEmpty, verifyEmail } from '../utils/validations.js'

export const createUser = async (req, res) => {
    try {
        let data = req.body

        let { valid, field } = validateFieldIsEmpty(data, ['name', 'lastName', 'email', 'password', 'rol'])
        if (!valid) return res.status(400).send({ message: `${field} is required` })

        if (!verifyEmail(data.email)) return res.status(400).send({ message: 'Invalid email format' })

        let isExistsEmail = await User.findOne({ email: data.email })
        if (isExistsEmail) return res.status(409).send({ message: 'Email already exists' })

        if (!data.password || data.password.length < 8) return res.status(400).send({ message: 'The password must contain at least 8 digits' })

        data.password = await encrypt(data.password)

        let user = new User(data)
        await user.save()

        return res.status(201).send({ message: 'Registered successfully' })
    } catch (error) {
        console.error(error)
        return res.status(500).send({ message: 'Error registering user' })
    }
}

export const login = async (req, res) => {
    try {
        let { email, password } = req.body

        let { valid, field } = validateFieldIsEmpty(req.body, ['email', 'password'])
        if (!valid) return res.status(400).send({ message: `${field} is empty` })

        if (!verifyEmail(email)) return res.status(400).send({ message: 'Invalid email format' })

        let user = await User.findOne({ email: email })

        if (user && await validatePassword(password, user.password)) {
            let loggedUser = {
                uid: user._id,
                name: user.name,
                email: user.email,
                rol: user.rol
            }

            let token = await generateToken(loggedUser)

            return res.send({
                message: `Welcome ${loggedUser.name}`,
                loggedUser,
                token
            })
        }

        return res.status(401).send({ message: 'Invalid credentials' })
    } catch (error) {
        console.error(error)
        return res.status(500).send({ message: 'Error logging in' })
    }
}