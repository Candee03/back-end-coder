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
    age : Number,
    password : String,
    img : String,
    role: {
        type: String, 
        default: 'usuario'
    },
    cartId : {
        default : '6486ae50710ab0ff4b45f54f', //<--SETEO POR DEFECTO LA ID DEL CARRITO QUE YA ESTA CREADO
		type: String,
    }
})

export const userModel = mongoose.model('user', userSchema)