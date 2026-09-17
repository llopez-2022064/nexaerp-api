import { PERMISSIONS } from "../consts/permissions.js";

export const checkPermission = (module, action) => {
    return (req, res, next) => {
        const rol = req.user.rol
        const rolePermissions = PERMISSIONS[rol];

        if (!rolePermissions || !rolePermissions[module]?.includes(action)) {
            return res.status(403).send({ message: 'You do not have permission for this action' })
        }

        next()
    }
}