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
        default : [],
		type: [
			{
				id: {
					index: true,
					type: mongoose.Schema.Types.ObjectId,
					ref: 'carts',
				}
			},
		],
    }
})

export const userModel = mongoose.model('user', userSchema)