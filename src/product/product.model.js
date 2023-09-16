import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

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
		index: true
	},
	thumbnail: {
		type: Array,
		required: true,
	},
	code: {
		type: String,
		required: true,
		unique: true,
		index: true
	},
	status: {
		type: Boolean,
		default: true
	},
	category: {
		type: String,
		required: true,
		index: true
	},
	stock: {
		type: Number,
		required: true,
	},
	owner: {
		type: String,
		default: 'admin',
	}
});

productSchema.plugin(mongoosePaginate);

export const productModel = mongoose.model('products', productSchema);