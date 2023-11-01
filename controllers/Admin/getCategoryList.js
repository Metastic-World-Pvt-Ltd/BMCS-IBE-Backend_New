const ProductList = require('../../models/ProductList');

module.exports.getCategoryList = async function(req , res){
    const category = req.headers['category'];

    const getData = await ProductList.find({category});

    res.json(getData);
}