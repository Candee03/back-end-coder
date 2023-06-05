import mongoose from 'mongoose';

const cartSchema = new mongoose.Schema({
	products: [
		{
			_id : false,
			pid: String,
			quantity: {
				type: Number,
				default: 1,
			}
		}
	],
});

export const cartModel = mongoose.model('carts', cartSchema);