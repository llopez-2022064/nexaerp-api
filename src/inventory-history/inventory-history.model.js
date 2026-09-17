import { model, Schema } from "mongoose";

const invetoryHistorySchema = new Schema({
    movement: {
        type: String,
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }
}, {
    versionKey: false,
    timestamps: true
})

export default model('inventoryHistory', invetoryHistorySchema)