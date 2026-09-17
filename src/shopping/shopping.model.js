import { model, Schema } from "mongoose";

const shoppingSchema = new Schema({
    product: {
        type: Schema.ObjectId,
        ref: 'product',
        required: true
    },
    amount: {
        type: Number,
        required: true,
        default: 0
    },
    unitCost: {
        type: Number,
        required: true,
        default: 0
    },
    purchaseDate: {
        type: Date,
        required: true,
        default: Date.now
    }
}, {
    versionKey: false,
    timestamps: true
})

export default model('shopping', shoppingSchema)