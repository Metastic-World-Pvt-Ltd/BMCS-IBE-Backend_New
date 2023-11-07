const ProductList = require('../../models/ProductList');
const errorMessages = require('../../response/errorMessages');
const successMessages = require('../../response/successMessages');
const logger = require('../User/logger');
module.exports.addProductList = async function(req, res){
try {
    logger.info(successMessages.START)
    logger.info(successMessages.ACTIVATED_ADD_PRODUCT_LIST)
    var {productName , category , subCategory } = req.body;
    logger.info(`Input - ${productName} , ${category} , ${subCategory}`)
    const productId = Date.now();

    if(!category){
      category = '';
    }else if(!subCategory){
      subCategory = '';
    }

    const isExist = await ProductList.find({productName});
    logger.info(`Data in DB - ${isExist}`)

    if(isExist.length != 0){
      logger.error(errorMessages.PRODUCT_ALREADY_EXIST)
      logger.info(successMessages.END)
      return res.status(422).json(errorMessages.PRODUCT_ALREADY_EXIST);
    }

        try {
          const product1 = new ProductList({
            productId,
            productName ,
            category,
            subCategory,

          });

        await product1.save();
        logger.info(product1)
        logger.info(successMessages.END) 
        res.status(200).json(product1);
        } catch (error) {
          logger.error(error)
          return res.status(503).json(error)
        }
} catch (error) {
  logger.error(errorMessages.ADD_PRODUCT_LIST_FAILED)
  return res.status(500).json(errorMessages.INTERNAL_ERROR)
}
}