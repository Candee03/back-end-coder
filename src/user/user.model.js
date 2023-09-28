import mongoose from "mongoose";
import { cartModel } from "../cart/cart.model.js";

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
        default: 'user'
    },
    cartId : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'carts',
    },
    documents : {
        default: [],
        type: [
            {
                name : String,
                reference : String
            }
        ],
    },
    last_connection : {
        type: String,
        default: new Date().toLocaleString()
    }

})

userSchema.pre('findOne', function (next) {
    this.populate('cartId');
    next();
});

export const userModel = mongoose.model('user', userSchema)