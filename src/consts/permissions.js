export const PERMISSIONS = {
    Administrador: {
        products: ['view', 'create', 'edit', 'delete'],
        sales: ['view', 'create', 'edit', 'delete'],
        shopping: ['view', 'create', 'edit', 'delete'],
        inventory: ['view', 'create', 'edit', 'delete'],
        users: ['view', 'create', 'edit', 'delete'],
        inventoryHistory: ['view'],
        reports: ['generar'],
    },
    Operativo: {
        products: ['view'],
        inventory: ['view'],
        inventoryHistory: ['view'],
        shopping: ['view', 'create'],
        sales: ['view', 'create'],
        reports: ['view']
    },
    Tecnico: {
        products: ['view', 'create', 'edit'],
        inventory: ['view', 'create', 'edit'],
        inventoryHistory: ['view'],
        reports: ['view']
    }
}