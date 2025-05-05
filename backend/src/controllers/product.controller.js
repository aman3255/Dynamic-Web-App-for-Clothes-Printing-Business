const ProductModel = require('./../models/product.model');


const retrieveProducts = async (req, res) => {
    try {
        const { category } = req.query;

        let products;
        if (category) {
            products = await ProductModel.find({ category });
        } else {
            products = await ProductModel.find();
        }

        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving products', error: error.message });
    }
};

module.exports = {
    retrieveProducts
};