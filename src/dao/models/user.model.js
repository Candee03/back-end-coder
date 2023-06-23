import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    first_name : String,
    last_name : String,
    email : {
        type: String, 
        required :true, 
        unique: true, 
        index : true
    },
    password : String,
    img : String,
    rol: {type: String, default: 'usuario'}
})

export const userModel = mongoose.model('user', userSchema)