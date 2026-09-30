import ExcelJs from 'exceljs'

export const createExcel = async (data, columns) => {
    const workbook = new ExcelJs.Workbook()
    const worksheet = workbook.addWorksheet('Reporte')

    worksheet.addRow([data.title])
    worksheet.addRow([`Periodo: ${data.period}`])
    worksheet.addRow([`${data.description}: ${data.elements.length}`])
    worksheet.addRow([])

    const headerRow = worksheet.addRow(
        columns.map((column) => column.header)
    )

    headerRow.font = { bold: true }

    for (const element of data.elements) {
        worksheet.addRow(
            columns.map((column) => column.getValue(element) ?? null)
        )
    }

    columns.forEach((column, index) => {
        const excelColumn = worksheet.getColumn(index + 1)

        excelColumn.width = 25

        if (column.numFmt) {
            excelColumn.numFmt = column.numFmt
        }
    })

    const buffer = await workbook.xlsx.writeBuffer()
    return Buffer.from(buffer)
}