const Product = require('../../models/Product');
const errorMessages = require('../../response/errorMessages');
const successMessages = require('../../response/successMessages');
const logger = require('../User/logger');

module.exports.getAllProducts = async function(req , res){
    logger.info(successMessages.START);
    logger.info(successMessages.GET_ALL_PRODUCT_ACTIVATED)

    try {
        const data =  await Product.find();

        if (data) {
            logger.info(`Output - ${successMessages.DATA_SEND_SUCCESSFULLY}`);
            logger.info(successMessages.END)
            return res.status(200).json(data)
        }else{
            logger.error(errorMessages.NOT_FOUND)
            return res.status(404).json(errorMessages.NOT_FOUND)
        }
    } catch (error) {
        logger.error(error)
        return res.status(502).json(errorMessages.BAD_GATEWAY)
    }
}