import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
	title: {
		type: String,
		required: true,
	},
	description: {
		type: String,
		required: true,
	},
	price: {
		type: Number,
		required: true,
	},
	thumbnail: {
		type: Array,
		required: true,
	},
	code: {
		type: String,
		required: true,
		unique: true,
	},
	status: {
		type: Boolean,
		required: true,
	},
	category: {
		type: String,
		required: true,
	},
	stock: {
		type: Number,
		required: true,
	}
});

export const productModel = mongoose.model('products', productSchema);