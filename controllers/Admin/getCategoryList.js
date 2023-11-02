const ProductList = require('../../models/ProductList');
const errorMessages = require('../../response/errorMessages');
const successMessages = require('../../response/successMessages');
const logger = require('../User/logger');

module.exports.getCategoryList = async function(req , res){
try {
    logger.info(successMessages.START);
    logger.info(successMessages.ACTIVATED_GET_CATEGORY_LIST)

    const category = req.headers['category'];
    logger.info(`Input - ${category}`);
    if(!category){
        logger.error(errorMessages.ALL_FIELDS_REQUIRED)
        return res.status(400).json(errorMessages.ALL_FIELDS_REQUIRED)
    }

    try {
        const getData = await ProductList.find({category});

        if(getData){
            logger.info(`Output - ${successMessages.DATA_SEND_SUCCESSFULLY}`)
            return res.status(200).json(getData);
        }else{
            logger.error(errorMessages.NOT_FOUND)
            return res.status(404).json(errorMessages.NOT_FOUND)
        }
    } catch (error) {
        logger.error(error);
        return res.status(502).json(errorMessages.BAD_GATEWAY);
    }
} catch (error) {
    logger.error(errorMessages.GET_CATEGORY_LIST_FAILED)
    return res.status(500).json(errorMessages.INTERNAL_ERROR)
}
}