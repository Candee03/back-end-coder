import mongoose from "mongoose";

const tiketSchema = new mongoose.Schema({
    code: {
        type: String,
        required : true
    },
    purchase_datetime: Date,
    amount: {
        type: Number,
        required : true
    },
    purchaser: {
        type: String,
        required : true
    }
})

export const tiketModel = mongoose.model('tikets', tiketSchema)