export class ShowProductDto {
    constructor(product) {
        this.title= product.title
        this.description= product.description
        this.price= product.price
        this.thumbnail= product.thumbnail
        this.code= product.code
        this.status = product.stock>0? true : false
        this.category= product.category
        this.stock= product.stock
        this._id= product._id
    }

    getProduct() {
        return {
            title: this.title,
            description: this.description,
            price: this.price,
            thumbnail: this.thumbnail,
            code: this.code,
            status: this.status,
            category: this.category,
            stock: this.stock,
            _id: this._id,
        }
    }
    getSimpleProduct() {
        return {
            title: this.title,
            description: this.description,
            price: this.price,
            thumbnail: this.thumbnail,
            status: this.status,
            category: this.category,
            _id: this._id,
        }
    }
}