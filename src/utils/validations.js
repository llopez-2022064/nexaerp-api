export const verifyEmail = (email) => {
    try {
        let regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
        return regex.test(email)
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