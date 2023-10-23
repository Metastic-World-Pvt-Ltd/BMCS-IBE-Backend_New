const ProductList = require('../../models/ProductList');

module.exports.addProductList = async function(req, res){
    var {productName , category , subCategory } = req.body;

    const productId = Date.now();

    if(!category){
      category = null;
    }else if(!subCategory){
      subCategory = null;
    }
    const isExist = await ProductList.find(productName);
    if(isExist){
      return res.status(422).json(`Product Name Already Exist`);
    }
const data = req.body;
    const product1 = new ProductList({
        productId,
        data,
        productName ,
        category,
        subCategory,

      });

     await product1.save();

     res.json(product1);
}