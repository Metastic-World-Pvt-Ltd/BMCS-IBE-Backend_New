const Kyc = require('../../models/Kyc');
const errorMessages = require('../../response/errorMessages');
const successMessages = require('../../response/successMessages');
const logger = require('./logger');

module.exports.getKycByempId = async function(req , res){
try {
    logger.info(successMessages.START);
    logger.info(successMessages.GET_KYC_BY_EMPID_ACTIAVTED)
    const empId = req.headers['id'];

    if(!empId){
        logger.error(errorMessages.ALL_FIELDS_REQUIRED)
        return res.status(400).json(errorMessages.ALL_FIELDS_REQUIRED)
    }

    try {
        const data = await Kyc.findOne({empId});

        if(!data){
            logger.error(errorMessages.NOT_FOUND)
            return res.status(404).json(errorMessages.NOT_FOUND)
        }else{
            logger.info(successMessages.DATA_SEND_SUCCESSFULLY)
            return res.status(200).json(data);
        }
    } catch (error) {
        logger.error(error);
        return res.status(502).json(errorMessages.BAD_GATEWAY)
    }
} catch (error) {
    logger.error(GET_KYC_BY_EMPID_FAILED)
    return res.status(500).json(errorMessages.INTERNAL_ERROR);
}

}