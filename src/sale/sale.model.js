import { model, Schema } from "mongoose";

const saleSchema = new Schema({
    product: {
        type: Schema.ObjectId,
        ref: 'product',
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    total: {
        type: Number
    },
    date: {
        type: Date,
        required: true,
        default: Date.now
    }
}, {
    versionKey: false,
    timestamps: true
})

export default model('sale', saleSchema)