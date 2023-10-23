const ProductList = require('../../models/ProductList');

module.exports.getProductList = async function(req, res){
    const category = 'main';
    const reqestData = req.body;
    console.log(reqestData);
    const data = await ProductList.find(reqestData);

    res.json(data);
}