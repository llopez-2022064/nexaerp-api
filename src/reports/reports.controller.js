import Sales from '../sale/sale.model.js'
import Shopping from '../shopping/shopping.model.js'
import History from '../inventory-history/inventory-history.model.js'
import Inventory from '../inventory/inventory.model.js'
import { formatDate, verifyDate } from '../utils/validations.js'
import { createPDF } from './pdf-report.js'
import { createExcel } from './excel-report.js'

export const getElements = async (startDate, endDate, model, relations = []) => {
    const start = new Date(`${startDate}T00:00:00.000Z`)
    const endExclusive = new Date(`${endDate}T00:00:00.000Z`)
    endExclusive.setUTCDate(endExclusive.getUTCDate() + 1)

    return model.find({ createdAt: { $gte: start, $lt: endExclusive } })
        .populate(relations)
        .select('-_id')
        .sort({ createdAt: -1 })
        .lean()
}

const isValidDate = (value) => {
    if (typeof value !== 'string' || !verifyDate(value)) return false
    const date = new Date(`${value}T00:00:00.000Z`)
    return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value
}

export const getReportPDFSales = async (req, res) => {
    try {
        const { startDate, endDate } = req.body ?? {}

        if (!isValidDate(startDate) || !isValidDate(endDate)) {
            return res.status(400).json({
                message: 'Envia fechas validas con formato YYYY-MM-DD'
            })
        }

        if (startDate > endDate) {
            return res.status(400).json({
                message: 'La fecha inicial no puede ser mayor que la final'
            })
        }

        const sales = await getElements(startDate, endDate, Sales, [{ path: 'product', select: 'name' }])

        const salesColumns = [
            {
                header: 'Producto',
                getValue: (sale) => sale.product?.name ?? 'No disponible'
            },
            {
                header: 'Cantidad',
                getValue: (sale) => sale.amount
            },
            {
                header: 'Fecha',
                getValue: (sale) => formatDate(sale.date)
            },
            {
                header: 'Total',
                getValue: (sale) => sale.total ?? 0,
                format: (value) => value.toFixed(2),
                numFmt: '#,##0.00'
            }
        ]

        const pdf = await createPDF({
            period: `${formatDate(startDate)} al ${formatDate(endDate)}`,
            elements: sales,
            title: 'Reporte de Ventas',
            description: 'Ventas realizadas'
        }, salesColumns)

        res.setHeader('Content-Type', 'application/pdf')
        res.setHeader('Content-Disposition', 'attachment; filename="ventas.pdf"')
        return res.send(pdf)
    } catch (error) {
        console.error('Error al generar el reporte:', error)
        return res.status(500).json({ message: 'No se pudo generar el reporte' })
    }
}

export const getReportPDFShopping = async (req, res) => {
    try {
        const { startDate, endDate } = req.body ?? {}

        if (!isValidDate(startDate) || !isValidDate(endDate)) {
            return res.status(400).json({
                message: 'Envia fechas validas con formato YYYY-MM-DD'
            })
        }

        if (startDate > endDate) {
            return res.status(400).json({
                message: 'La fecha inicial no puede ser mayor que la final'
            })
        }

        const shopping = await getElements(startDate, endDate, Shopping, [{ path: 'product', select: 'name' }])

        const shoppingColumns = [
            {
                header: 'Producto',
                getValue: (shopping) => shopping.product?.name ?? 'No disponible'
            },
            {
                header: 'Cantidad',
                getValue: (shopping) => shopping.amount
            },
            {
                header: 'Costo unitario',
                getValue: (shopping) => shopping.unitCost,
                format: (value) => value.toFixed(2),
                numFmt: '#,##0.00'
            },
            {
                header: 'Fecha',
                getValue: (shopping) => formatDate(shopping.purchaseDate)
            }
        ]

        const pdf = await createPDF({
            period: `${formatDate(startDate)} al ${formatDate(endDate)}`,
            elements: shopping,
            title: 'Reporte de Compras',
            description: 'Compras realizadas'
        }, shoppingColumns)

        res.setHeader('Content-Type', 'application/pdf')
        res.setHeader('Content-Disposition', 'attachment; filename="compras.pdf"')
        return res.send(pdf)
    } catch (error) {
        console.error('Error al generar el reporte:', error)
        return res.status(500).json({ message: 'No se pudo generar el reporte' })
    }
}

export const getReportPDFHistory = async (req, res) => {
    try {
        const { startDate, endDate } = req.body ?? {}

        if (!isValidDate(startDate) || !isValidDate(endDate)) {
            return res.status(400).json({
                message: 'Envia fechas validas con formato YYYY-MM-DD'
            })
        }

        if (startDate > endDate) {
            return res.status(400).json({
                message: 'La fecha inicial no puede ser mayor que la final'
            })
        }

        const history = await getElements(startDate, endDate, History)

        const historyColumns = [
            {
                header: 'Movimiento',
                getValue: (history) => history.movement
            },
            {
                header: 'Cantidad',
                getValue: (history) => history.amount
            },
            {
                header: 'Fecha',
                getValue: (history) => formatDate(history.date)
            }
        ]

        const pdf = await createPDF({
            period: `${formatDate(startDate)} al ${formatDate(endDate)}`,
            elements: history,
            title: 'Historial de movimientos',
            description: 'Movimientos registrados'
        }, historyColumns)

        res.setHeader('Content-Type', 'application/pdf')
        res.setHeader('Content-Disposition', 'attachment; filename="historial.pdf"')
        return res.send(pdf)
    } catch (error) {
        console.error('Error al generar el reporte:', error)
        return res.status(500).json({ message: 'No se pudo generar el reporte' })
    }
}

export const getReportPDFInventory = async (req, res) => {
    try {
        const { startDate, endDate } = req.body ?? {}

        if (!isValidDate(startDate) || !isValidDate(endDate)) {
            return res.status(400).json({
                message: 'Envia fechas validas con formato YYYY-MM-DD'
            })
        }

        if (startDate > endDate) {
            return res.status(400).json({
                message: 'La fecha inicial no puede ser mayor que la final'
            })
        }

        const inventory = await getElements(startDate, endDate, Inventory, [{ path: 'product', select: 'name' }])

        const inventoryColumns = [
            {
                header: 'Producto',
                getValue: (inventory) => inventory.product?.name ?? 'No disponible'
            },
            {
                header: 'Existencias actuales',
                getValue: (inventory) => inventory.amount
            },
            {
                header: 'Fecha de registro',
                getValue: (inventory) => formatDate(inventory.createdAt)
            }
        ]

        const pdf = await createPDF({
            period: `${formatDate(startDate)} al ${formatDate(endDate)}`,
            elements: inventory,
            title: 'Reporte de Inventario',
            description: 'Registros de inventario creados en el periodo'
        }, inventoryColumns)

        res.setHeader('Content-Type', 'application/pdf')
        res.setHeader('Content-Disposition', 'attachment; filename="inventario.pdf"')
        return res.send(pdf)
    } catch (error) {
        console.error('Error al generar el reporte:', error)
        return res.status(500).json({ message: 'No se pudo generar el reporte' })
    }
}

export const getReportExcelSales = async (req, res) => {
    try {
        const { startDate, endDate } = req.body ?? {}

        if (!isValidDate(startDate) || !isValidDate(endDate)) {
            return res.status(400).json({
                message: 'Envía fechas válidas con formato YYYY-MM-DD'
            })
        }

        if (startDate > endDate) {
            return res.status(400).json({
                message: 'La fecha inicial no puede ser mayor que la final'
            })
        }

        const sales = await getElements(
            startDate,
            endDate,
            Sales,
            [{ path: 'product', select: 'name' }]
        )

        const salesColumns = [
            {
                header: 'Producto',
                getValue: (sale) => sale.product?.name ?? 'No disponible'
            },
            {
                header: 'Cantidad',
                getValue: (sale) => sale.amount
            },
            {
                header: 'Fecha',
                getValue: (sale) => formatDate(sale.date)
            },
            {
                header: 'Total',
                getValue: (sale) => sale.total ?? 0,
                numFmt: '#,##0.00'
            }
        ]

        const excel = await createExcel({
            title: 'Reporte de Ventas',
            period: `${formatDate(startDate)} al ${formatDate(endDate)}`,
            description: 'Ventas realizadas',
            elements: sales
        }, salesColumns)

        res.setHeader(
            'Content-Type',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        )

        res.setHeader(
            'Content-Disposition',
            'attachment; filename="ventas.xlsx"'
        )

        return res.send(excel)
    } catch (error) {
        console.error('Error al generar el Excel:', error)

        return res.status(500).json({
            message: 'No se pudo generar el reporte'
        })
    }
}

export const getReportExcelShopping = async (req, res) => {
    try {
        const { startDate, endDate } = req.body ?? {}

        if (!isValidDate(startDate) || !isValidDate(endDate)) {
            return res.status(400).json({
                message: 'Envia fechas validas con formato YYYY-MM-DD'
            })
        }

        if (startDate > endDate) {
            return res.status(400).json({
                message: 'La fecha inicial no puede ser mayor que la final'
            })
        }

        const shopping = await getElements(startDate, endDate, Shopping, [{ path: 'product', select: 'name' }])

        const shoppingColumns = [
            {
                header: 'Producto',
                getValue: (shopping) => shopping.product?.name ?? 'No disponible'
            },
            {
                header: 'Cantidad',
                getValue: (shopping) => shopping.amount
            },
            {
                header: 'Costo unitario',
                getValue: (shopping) => shopping.unitCost,

                numFmt: '#,##0.00'
            },
            {
                header: 'Fecha',
                getValue: (shopping) => formatDate(shopping.purchaseDate)
            }
        ]

        const excel = await createExcel({
            period: `${formatDate(startDate)} al ${formatDate(endDate)}`,
            elements: shopping,
            title: 'Reporte de Compras',
            description: 'Compras realizadas'
        }, shoppingColumns)

        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
        res.setHeader('Content-Disposition', 'attachment; filename="compras.xlsx"')
        return res.send(excel)
    } catch (error) {
        console.error('Error al generar el reporte:', error)
        return res.status(500).json({ message: 'No se pudo generar el reporte' })
    }
}

export const getReportExcelHistory = async (req, res) => {
    try {
        const { startDate, endDate } = req.body ?? {}

        if (!isValidDate(startDate) || !isValidDate(endDate)) {
            return res.status(400).json({
                message: 'Envia fechas validas con formato YYYY-MM-DD'
            })
        }

        if (startDate > endDate) {
            return res.status(400).json({
                message: 'La fecha inicial no puede ser mayor que la final'
            })
        }

        const history = await getElements(startDate, endDate, History)

        const historyColumns = [
            {
                header: 'Movimiento',
                getValue: (history) => history.movement
            },
            {
                header: 'Cantidad',
                getValue: (history) => history.amount
            },
            {
                header: 'Fecha',
                getValue: (history) => formatDate(history.date)
            }
        ]

        const excel = await createExcel({
            period: `${formatDate(startDate)} al ${formatDate(endDate)}`,
            elements: history,
            title: 'Historial de movimientos',
            description: 'Movimientos registrados'
        }, historyColumns)

        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
        res.setHeader('Content-Disposition', 'attachment; filename="historial.xlsx"')
        return res.send(excel)
    } catch (error) {
        console.error('Error al generar el reporte:', error)
        return res.status(500).json({ message: 'No se pudo generar el reporte' })
    }
}

export const getReportExcelInventory = async (req, res) => {
    try {
        const { startDate, endDate } = req.body ?? {}

        if (!isValidDate(startDate) || !isValidDate(endDate)) {
            return res.status(400).json({
                message: 'Envia fechas validas con formato YYYY-MM-DD'
            })
        }

        if (startDate > endDate) {
            return res.status(400).json({
                message: 'La fecha inicial no puede ser mayor que la final'
            })
        }

        const inventory = await getElements(startDate, endDate, Inventory, [{ path: 'product', select: 'name' }])

        const inventoryColumns = [
            {
                header: 'Producto',
                getValue: (inventory) => inventory.product?.name ?? 'No disponible'
            },
            {
                header: 'Existencias actuales',
                getValue: (inventory) => inventory.amount
            },
            {
                header: 'Fecha de registro',
                getValue: (inventory) => formatDate(inventory.createdAt)
            }
        ]

        const excel = await createExcel({
            period: `${formatDate(startDate)} al ${formatDate(endDate)}`,
            elements: inventory,
            title: 'Reporte de Inventario',
            description: 'Registros de inventario creados en el periodo'
        }, inventoryColumns)

        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
        res.setHeader('Content-Disposition', 'attachment; filename="inventario.xlsx"')
        return res.send(excel)
    } catch (error) {
        console.error('Error al generar el reporte:', error)
        return res.status(500).json({ message: 'No se pudo generar el reporte' })
    }
}
