import mongoose from 'mongoose'
import mongoosePageinate from 'mongoose-paginate-v2'

const { Schema } = mongoose

const ProductSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
            minlength: 1
        },
        price: {
            type: Number,
            required: true
        },
        description: {
            type: String,
            required: true
        },
        category: {
            type: String,
            required: true
        },
        countInStock: {
            type: Number,
            required: true
        },
        productImages: {
            type: [String],
            required: true
        },
        sold: {
            type: Number,
            default: 0
        },
        monthlyRevenue: {
            type: Map,
            of: Number,
            default: {}
        }
    },
    { timestamps: true }
)

ProductSchema.plugin(mongoosePageinate)

const Product = mongoose.model('Product', ProductSchema)
export default Product
