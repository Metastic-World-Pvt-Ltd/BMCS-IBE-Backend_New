const HomeBanner = require('../../models/HomeBanner');
const errorMessages = require('../../response/errorMessages');
const successMessages = require('../../response/successMessages');
const logger = require('../User/logger');

module.exports.getHomeBanner = async function(req , res){
try {
    logger.info(successMessages.START);
    logger.info(successMessages.GET_HOME_BANNER_ACTIVATED);

    try {
        const data =  await HomeBanner.find();

        if(data.length == 0){
            logger.error(errorMessages.NOT_FOUND)
            return res.status(404).json(errorMessages.NOT_FOUND);
        }else{
            logger.info(successMessages.DATA_SEND_SUCCESSFULLY);
            logger.info(successMessages.END)
            return res.status(200).json(data)
        }
    } catch (error) {
        logger.error(error);
        return res.status(502).json(errorMessages.BAD_GATEWAY)
    }
} catch (error) {
    logger.error(errorMessages.GET_HOME_BANNER_FAILED)
    return res.status(500).json(errorMessages.INTERNAL_ERROR)
}

}