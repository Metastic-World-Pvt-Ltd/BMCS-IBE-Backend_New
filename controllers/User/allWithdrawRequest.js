const History = require('../../models/History');
const errorMessages = require('../../response/errorMessages');
const successMessages = require('../../response/successMessages');
const logger = require('./logger');
module.exports.allWithdrawRequest = async function(req, res){
try {
    //find all withdraw request
    logger.info(successMessages.ALL_WITHDRAW_REQUEST_ACTIVATED)
    const allData = await History.find({origin:'withdraw'});
    //check for records in DB
    if(allData.length == 0){
        logger.error(errorMessages.NOT_FOUND)
        return res.status(errorMessages.NOT_FOUND)
    }else{
        logger.info(`Output - ${allData}`)
        res.status(200).json(allData); 
    }
} catch (error) {
    logger.error(errorMessages.ALL_WITHDRAW_REQUEST_FAILED)
    return res.status(500).json(errorMessages.INTERNAL_ERROR)
}
    
}