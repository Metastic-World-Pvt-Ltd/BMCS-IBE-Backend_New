const Kyc = require('../../models/Kyc');
const errorMessages = require('../../response/errorMessages');
const successMessages = require('../../response/successMessages');
const logger = require('../User/logger');

module.exports.getInpKyc = async function(req, res){
try {
    logger.info(successMessages.START)
    logger.info(successMessages.GET_INP_KYC)
    const status = req.headers['status'];
    if(!status){
        try {
            const data =  await Kyc.find();
            if(data.length == 0){
                return res.status(404).json(errorMessages.NOT_FOUND)
            }else{
                return res.status(200).json(data);
            }
        } catch (error) {
            logger.error(error)
            return res.status(502).json(errorMessages.BAD_GATEWAY)
        }
    }else{
        try {
            const data = await Kyc.find({status});
    
            if(data.length == 0){
                logger.error(errorMessages.NOT_FOUND)
                return res.status(404).json(errorMessages.NOT_FOUND)
            }else{       
                logger.info(successMessages.DATA_SEND_SUCCESSFULLY) 
                return res.status(200).json(data)
            }
        } catch (error) {
            logger.error(error)
            return res.status(502).json(errorMessages.BAD_GATEWAY)
        }
    } 
    
} catch (error) {
    logger.error(error);
    return res.status(500).json(errorMessages.INTERNAL_ERROR)
}

}