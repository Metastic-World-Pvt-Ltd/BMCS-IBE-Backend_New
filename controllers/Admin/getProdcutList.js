const ProductList = require('../../models/ProductList');
const errorMessages = require('../../response/errorMessages');
const successMessages = require('../../response/successMessages');
const logger = require('../User/logger');

module.exports.getProductList = async function(req, res){
try {
    logger.info(successMessages.START);
    logger.info(successMessages.ACTIVATED_GET_PRODUCT_LIST)

    if(!req.body){
        logger.error(errorMessages.ALL_FIELDS_REQUIRED);
        return res.status(400).json(errorMessages.ALL_FIELDS_REQUIRED)
    }
    const reqestData = req.body;
    logger.info(`Input - ${reqestData}`)
    
    try {
        const data = await ProductList.find(reqestData);
        
        if(data.length == 0){
            logger.error(errorMessages.NOT_FOUND);
            return res.status(404).json(errorMessages.NOT_FOUND)
            
        }else{
            logger.info(`Output - ${successMessages.DATA_SEND_SUCCESSFULLY}`)
            return res.status(200).json(data)
        }
    } catch (error) {
        logger.error(error)
        return res.status(502).json(errorMessages.BAD_GATEWAY);
    }
} catch (error) {
    logger.error(errorMessages.GET_PRODUCT_LIST_FAILED)
    return res.status(500).json(errorMessages.INTERNAL_ERROR)
}
}