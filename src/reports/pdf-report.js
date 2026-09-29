import PDFDocument from 'pdfkit'
import { fileURLToPath } from 'node:url'

const LOGO_PATH = fileURLToPath(new URL('./assets/nexaerp-logo.png', import.meta.url))

export const createPDF = (data, columns) => new Promise((resolve, reject) => {
    const document = new PDFDocument({ size: 'A4', margin: 40 })
    const chunks = []

    document.on('data', (chunk) => chunks.push(chunk))
    document.on('end', () => resolve(Buffer.concat(chunks)))
    document.on('error', reject)

    try {
        document.image(LOGO_PATH, 40, 30, { width: 60 })
        document.font('Helvetica-Bold').fontSize(16)
            .text(data.title, 115, 48)
        document.font('Helvetica').fontSize(11)
            .text(`Periodo: ${data.period}`, 40, Math.max(110, document.y + 15))
        document.text(`${data.description}: ${data.elements.length}`)
        document.moveDown()

        if (data.elements.length === 0) {
            document.text('No hay registros para el periodo seleccionado.')
        }

        const rows = data.elements.map((element) =>
            columns.map((column) => {
                const value = column.getValue(element)
                return value == null ? '' : column.format ? column.format(value) : String(value)
            })
        )

        if (rows.length > 0) {
            document.fontSize(10).table({
                defaultStyle: { border: 0.5, borderColor: '#CCCCCC', padding: 6 },
                rowStyles: (index) => index === 0 ? { backgroundColor: '#EEEEEE' } : {},
                data: [columns.map((column) => column.header), ...rows]
            })
        }

        document.end()
    } catch (error) {
        document.destroy()
        reject(error)
    }
})
