const AMC = require('../../models/AMC');
const errorMessages = require('../../response/errorMessages');
const successMessages = require('../../response/successMessages');
const logger = require('../User/logger');

module.exports.getAMC = async function(req , res){
try {
    logger.info(successMessages.START);
    logger.info(successMessages.GET_AMC_ACTIVATED);
    const contact = req.headers['contact'];
    const page = parseInt(req.query.page) || 1;
    const limit = 8;

    var data, count ;
    if(contact){
        const countData = data = await AMC.find({contact});
        count = countData.length;

        data = await AMC.find({contact})
        .skip((page -1)*limit)
        .limit(limit);
      
    }else{
        const countData = data = await AMC.find();
        count = countData.length;

        data = await AMC.find()
        .skip((page -1)*limit)
        .limit(limit);
    }
    try {

        if(data){
            logger.info(successMessages.DATA_SEND_SUCCESSFULLY)
            return res.status(200).json({
                page,
                totalPages: Math.ceil(count / limit),
                'AMC':data
            })
        }else{
            logger.info(errorMessages.NOT_FOUND)
            return res.status(404).json(errorMessages.NOT_FOUND)
        }
    } catch (error) {
        logger.error(error)
        return res.status(502).json(errorMessages.BAD_GATEWAY)
    }
} catch (error) {
    logger.error(errorMessages.GET_AMC_FAILED);
    return res.status(500).json(errorMessages.INTERNAL_ERROR)
}
}