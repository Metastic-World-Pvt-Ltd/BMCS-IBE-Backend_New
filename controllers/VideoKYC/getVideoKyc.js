const VideoKYC = require('../../models/VideoKYC');
const errorMessages = require('../../response/errorMessages');
const successMessages = require('../../response/successMessages');
const logger = require('../User/logger');

module.exports.getVideoKyc = async function(req , res){
    logger.info(successMessages.START)
    logger.info(successMessages.GET_INP_KYC)
    const status = req.headers['status'];
    const page = parseInt(req.query.page) || 1;
    const limit = 8;

    if(!status){
        try {
            const count =  await VideoKYC.countDocuments();

            const data =  await VideoKYC.find()
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
                    'VideoKYC':data
                });
            }
        } catch (error) {
            logger.error(error)
            return res.status(502).json(errorMessages.BAD_GATEWAY)
        }
    }else{
        try {
            const countData = await VideoKYC.find({status});
            const count = countData.length;

            const data = await VideoKYC.find({status})
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
                    'VideoKYC':data
                })
            }
        } catch (error) {
            logger.error(error)
            return res.status(502).json(errorMessages.BAD_GATEWAY)
        }
    } 
    
}