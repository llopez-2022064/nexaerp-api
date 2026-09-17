import { model, Schema } from "mongoose";

const userSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    rol: {
        type: String,
        enum: ['Administrador', 'Tecnico', 'Operativo'],
        default: 'Operativo'
    }
}, {
    versionKey: false,
    timestamps: true
})

export default model('user', userSchema)