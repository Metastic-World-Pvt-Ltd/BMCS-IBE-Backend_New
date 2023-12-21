const History = require('../../models/History');
const errorMessages = require('../../response/errorMessages');
const successMessages = require('../../response/successMessages');
const logger = require('../User/logger');

module.exports.getAllWithdraw = async function(req , res){
try {
    logger.info(successMessages.START);
    logger.info(successMessages.GET_ALL_WITHDRAW_REQUEST_ACTIVATED)
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = 8;
        const countData = await History.find({origin:'Withdraw'});
        const count  = countData.length;

        const data = await History.find({origin:'Withdraw'})
        .skip((page -1)* limit)
        .limit(limit)
    
        if(data.length == 0){
            return res.status(404).json(errorMessages.NOT_FOUND)
        }
        logger.info(successMessages.DATA_SEND_SUCCESSFULLY)
        logger.info(successMessages.END)
        return res.status(200).json({
            page,
            totalPages: Math.ceil(count / limit),
            'History':data
        })
    } catch (error) {
        return res.status(502).json(errorMessages.BAD_GATEWAY)
    }
} catch (error) {
    logger.error(errorMessages.GET_ALL_WITHDRAW_REQUEST_FAILED)
    return res.status(500).json(errorMessages.INTERNAL_ERROR)
}
}