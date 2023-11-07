const ProductList =  require('../../models/ProductList');
const errorMessages = require('../../response/errorMessages');
const successMessages = require('../../response/successMessages');
const logger = require('../User/logger');

module.exports.deleteProductList = async function(req , res){
try {
    logger.info(successMessages.START);
    logger.info(successMessages.DELETE_PRODUCT_LIST_ACTIVATED)

    const {productId} = req.body;
    logger.info(`Input - ${productId}`)
    if(!productId){
        logger.error(errorMessages.ALL_FIELDS_REQUIRED);
        return res.status(400).json(errorMessages.ALL_FIELDS_REQUIRED);
    }

    const data =  await ProductList.findOneAndDelete({productId});

    if(data == null){
        logger.error(errorMessages.NOT_FOUND)
        return res.status(404).json(errorMessages.NOT_FOUND)
    }

    logger.info(successMessages.RECORD_DELETED_SUCCESSFULLY)
    logger.info(successMessages.END)
    return res.status(200).json(successMessages.RECORD_DELETED_SUCCESSFULLY)
} catch (error) {
    logger.error(errorMessages.DELETE_PRODUCT_LIST_FAILED)
    return res.status(500).json(errorMessages.INTERNAL_ERROR)
}
    
}