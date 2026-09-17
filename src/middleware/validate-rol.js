export const isAdmin = async (req, res, next) => {
    try {
        if (req.user.rol !== 'Administrador') {
            return res.status(403).send({ message: 'Access denied. Administrator only' })
        }

        next()
    } catch (error) {
        console.log(error)
        return res.status(500).send({ message: 'Unauthorized' })
    }
}

export const isOperational = async (req, res, next) => {
    try {
        if (!req.body) {
            return res.status(401).send({ message: 'Unauthorized' })
        }

        if (req.user.rol !== 'Operativo') {
            return res.status(403).send({ message: 'Access denied. Operational only' })
        }

        next()
    } catch (error) {
        console.log(error)
        return res.status(500).send({ message: 'Unauthorized' })
    }
}

export const isTechnician = async (req, res, next) => {
    try {
        if (!req.body) {
            return res.status(401).send({ message: 'Unauthorized' })
        }

        if (req.user.rol !== 'Tecnico') {
            return res.status(403).send({ message: 'Access denied. Technician only' })
        }

        next()
    } catch (error) {
        console.log(error)
        return res.status(500).send({ message: 'Unauthorized' })
    }
}