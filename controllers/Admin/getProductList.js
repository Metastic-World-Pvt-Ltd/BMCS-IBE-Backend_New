const ProductList = require('../../models/ProductList');

module.exports.getProductList = async function(req , res){
    const id = req.body.id || req.query.id || req.headers["id"];

    if(!id){
        return res.status(400).json(`Please Provide Id`)
    }

    const data = await ProductList.find({productId:id});

    res.json(data);
    

}