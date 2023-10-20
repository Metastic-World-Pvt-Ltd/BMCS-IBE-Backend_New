const mongoose =  require('mongoose');

const productSchema = new mongoose.Schema({
    productId:String,
    productName: String,
    // productDescription: String,
    subProducts: [
      {
        subProductId:String,
        subProductName: String,
        // subProductDescription: String,
        thirdList: [
          {
            thirdProductId: String,
            thirdProductName: String,
            // thirdProductDescription: String,
          },
        ],
      },
    ],
  });

  module.exports = mongoose.model('ProductList', productSchema);