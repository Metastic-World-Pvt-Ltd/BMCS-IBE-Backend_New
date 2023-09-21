const History = require('../../models/History');
const errorMessages = require('../../response/errorMessages');
const successMessages = require('../../response/successMessages');
const logger = require('./logger');
module.exports.updateWithdrawStatus = async function(req, res){
try {
    logger.info(`Start`);
    logger.info(successMessages.UPDATE_WITHDRAW_STATUS_ACTIVATED)
    //inout user ID
    const id = req.params.id || req.body.id || req.query.id || req.headers["id"];
    logger.info(`ID - ${id}`)
    //check for ID available or not
    if(!id){
        logger.error(errorMessages.UNIQUE_ID_MISSING)
        return res.status(400).json(errorMessages.UNIQUE_ID_MISSING)
    }
    //define the status
    const status = "completed";
    //update the status in DB
    const updateData = await History.findOneAndUpdate({transactionId:id},{status:status},{new:true})
    if(updateData){
        logger.info(`Output - ${updateData}`)
        logger.info(`End`);
        return res.status(200).json(updateData)
    }else{
        logger.error(errorMessages.NOT_FOUND)
        return res.status(404).json(errorMessages.NOT_FOUND)
    }
} catch (error) {
    logger.error(errorMessages.UPDATED_WITHDRAW_STATUS_FAILED)
    return res.status(errorMessages.INTERNAL_ERROR)
}
    
}