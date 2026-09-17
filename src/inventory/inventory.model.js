import { model, Schema } from "mongoose";

const inventorySchema = new Schema({
    product: {
        type: Schema.ObjectId,
        ref: 'product',
        required: true
    },
    amount: {
        type: Number,
        required: true,
        default: 0
    }
}, {
    versionKey: false,
    timestamps: true
})

export default model('inventory', inventorySchema)