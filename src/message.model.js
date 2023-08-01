import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
    user: String,
    message: String,
});

export const messageModel = mongoose.model('message', messageSchema);