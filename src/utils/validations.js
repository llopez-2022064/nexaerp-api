export const verifyEmail = (email) => {
    try {
        let regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
        return regex.test(email)
    } catch (error) {
        return false
    }
}

export const verifyDate = (date) => {
    try {
        let regex = /^\d{4}-\d{2}-\d{2}$/
        return regex.test(date)
    } catch (error) {
        return false
    }
}

const isEmptyValue = (value) => {
    if (value === null || value === undefined) {
        return true
    }

    if (typeof value === 'string') {
        return value.trim() === ''
    }

    if (Array.isArray(value)) {
        return value.length === 0
    }

    return false
}

export const validateNonEmptyFields = (
    data,
    fieldNames,
    { allowMissingFields = false } = {}
) => {
    for (const fieldName of fieldNames) {
        const fieldExists = Object.hasOwn(data ?? {}, fieldName)

        if (!fieldExists) {
            if (allowMissingFields) {
                continue
            }

            return { isValid: false, emptyField: fieldName }
        }

        if (isEmptyValue(data[fieldName])) {
            return { isValid: false, emptyField: fieldName }
        }
    }

    return { isValid: true }
}

export const validateAmount = (quantity) => {
    try {
        let regex = /^[+]?\d+(\.\d+)?$/
        return regex.test(quantity)
    } catch (error) {
        return false
    }
}

export const formatDate = (isoDate) => {
    const date = new Date(isoDate)

    if (!isoDate || Number.isNaN(date.getTime())) {
        return 'Fecha inválida'
    }

    return date.toLocaleDateString('es-GT', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        timeZone: 'UTC'
    })
}

export const validatePassword = (password) => {
    try {
        let regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^a-zA-Z0-9\s]).{10,}$/
        return regex.test(password)
    } catch (error) {
        return false
    }
}