const Kyc = require('../../models/Kyc');
const errorMessages = require('../../response/errorMessages');
const successMessages = require('../../response/successMessages');
const logger = require('../User/logger');

module.exports.getInpKyc = async function(req, res){
try {
    logger.info(successMessages.START)
    logger.info(successMessages.GET_INP_KYC)
    const status = req.headers['status'];
    const page = parseInt(req.query.page) || 1;
    const limit = 8;

    if(!status){
        try {
            const count =  await Kyc.countDocuments();

            const data =  await Kyc.find()
            .skip((page -1)*limit)
            .limit(limit)

            if(data.length == 0){
                logger.error(errorMessages.NOT_FOUND)
                return res.status(404).json(errorMessages.NOT_FOUND)
            }else{
                logger.info(successMessages.DATA_SEND_SUCCESSFULLY)
                return res.status(200).json({
                    page,
                    totalPages: Math.ceil(count / limit),
                    'Kyc':data
                });
            }
        } catch (error) {
            logger.error(error)
            return res.status(502).json(errorMessages.BAD_GATEWAY)
        }
    }else{
        try {
            const countData = await Kyc.find({status});
            const count = countData.length;

            const data = await Kyc.find({status})
            .skip((page -1)*limit)
            .limit(limit)
    
            if(data.length == 0){
                logger.error(errorMessages.NOT_FOUND)
                return res.status(404).json(errorMessages.NOT_FOUND)
            }else{       
                logger.info(successMessages.DATA_SEND_SUCCESSFULLY) 
                return res.status(200).json({
                    page,
                    totalPages: Math.ceil(count / limit),
                    'Kyc':data
                })
            }
        } catch (error) {
            logger.error(error)
            return res.status(502).json(errorMessages.BAD_GATEWAY)
        }
    } 
    
} catch (error) {
    logger.error(errorMessages.GET_ALL_KYC_FAILED);
    return res.status(500).json(errorMessages.INTERNAL_ERROR)
}

}