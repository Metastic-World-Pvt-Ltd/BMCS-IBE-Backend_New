const ProductList = require('../../models/ProductList');
const errorMessages = require('../../response/errorMessages');
const successMessages = require('../../response/successMessages');
const logger = require('../User/logger');

module.exports.getCategoryList = async function(req , res){
try {
    logger.info(successMessages.START);
    logger.info(successMessages.ACTIVATED_GET_CATEGORY_LIST)

    const category = req.headers['category'];
    const subCategory = req.headers['sub_category']

if(category){
    logger.info(`Input - ${category}`);
    try {
        const getData = await ProductList.find({category});
        
        if(getData.length == 0){
            logger.error(errorMessages.NOT_FOUND)
            return res.status(404).json(errorMessages.NOT_FOUND)
            
        }else{
            logger.info(`Output - ${successMessages.DATA_SEND_SUCCESSFULLY}`)
            return res.status(200).json(getData);
        }
    } catch (error) {
        logger.error(error);
        return res.status(502).json(errorMessages.BAD_GATEWAY);
    }
}else if(subCategory){
    logger.info(`Input - ${subCategory}`);
    try {
        const getData = await ProductList.find({subCategory});
        
        if(getData.length == 0){
            logger.error(errorMessages.NOT_FOUND)
            return res.status(404).json(errorMessages.NOT_FOUND)
            
        }else{
            logger.info(`Output - ${successMessages.DATA_SEND_SUCCESSFULLY}`)
            return res.status(200).json(getData);
        }
    } catch (error) {
        logger.error(error);
        return res.status(502).json(errorMessages.BAD_GATEWAY);
    }
}else{
    logger.error(errorMessages.ALL_FIELDS_REQUIRED)
    return res.status(400).json(errorMessages.ALL_FIELDS_REQUIRED)
}
} catch (error) {
    logger.error(errorMessages.GET_CATEGORY_LIST_FAILED)
    return res.status(500).json(errorMessages.INTERNAL_ERROR)
}
}