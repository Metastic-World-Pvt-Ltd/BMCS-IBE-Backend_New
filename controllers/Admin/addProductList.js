const ProductList = require('../../models/ProductList');

module.exports.addProductList = async function(req, res){
    const {productName , subProductName , thirdProductName } = req.body;

    const p_Id = Date.now();
    const subP_Id = `SUB`+Date.now();
    const thirdP_Id = `THI`+Date.now();
    console.log(p_Id , subP_Id ,thirdP_Id);

    const product1 = new ProductList({
        productId:p_Id,
        productName: productName,
        subProducts: [
          {
            subProductId:subP_Id,
            subProductName: subProductName,
            thirdList: [
              {
                thirdProductId:thirdP_Id,  
                thirdProductName: thirdProductName,
              },

            ],
          },

        ],
      });

     await product1.save();

     res.json(product1);
}