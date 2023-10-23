const mongoose =  require('mongoose');

const productSchema = new mongoose.Schema({
    productId:String,
    productName: String,
    category:String,
    subCategory:String,
  });

  module.exports = mongoose.model('ProductList', productSchema);