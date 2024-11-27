import Joi from 'joi'

export const addProductSchema = Joi.object({
    productId: Joi.string().required(),
    quantity: Joi.number().required()
})

export const flashSaleProduct = Joi.object({
    name: Joi.string().required(),
    salePrice: Joi.number().required(),
    flashSaleStart: Joi.date().required(),
    flashSaleEnd: Joi.date().required()
})
