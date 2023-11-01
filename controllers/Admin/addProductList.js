const ProductList = require('../../models/ProductList');

module.exports.addProductList = async function(req, res){
    var {productName , category , subCategory } = req.body;

    const productId = Date.now();

    if(!category){
      category = null;
    }else if(!subCategory){
      subCategory = null;
    }
    console.log(productName);
    const isExist = await ProductList.find({productName});
    console.log(isExist);
    if(isExist.length != 0){
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