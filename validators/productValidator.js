const Joi = require('joi');

const productSchema = Joi.object({
    name: Joi.string().required(),
    description: Joi.string().required(),
    price: Joi.number().required(),
    category: Joi.string().required(),
    stock: Joi.number().required(),
    supplier: Joi.string().required(),
});

// Función para validar el producto
const validateProduct = (product) => {
    return productSchema.validate(product);
};

module.exports = validateProduct;