import { model, Schema } from "mongoose";

const productSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    brand: {
        type: String,
        required: true
    },
    sellingPrice: {
        type: Number,
        required: true
    },
    status: {
        type: Boolean,
        required: true,
        default: true
    }
}, {
    versionKey: false,
    timestamps: true
})

export default model('product', productSchema)