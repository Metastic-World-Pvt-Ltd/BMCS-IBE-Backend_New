const ProductList = require('../../models/ProductList');

module.exports.addProductList = async function(req, res){
    const {productId , subProductName , thirdProductName } = req.body;


    const subP_Id = `SUB`+Date.now();
    const thirdP_Id = `THI`+Date.now();
    console.log(p_Id , subP_Id ,thirdP_Id);

    const product = new ProductList({productId});

    if(product){
        if(subProductName){
            const newSubProduct = {
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
        }

        product.subProducts.push(newSubProduct);
    }
    
    }
     await product1.save();

     res.json(product1);
}