const History = require('../../models/History');
const errorMessages = require('../../response/errorMessages');
const successMessages = require('../../response/successMessages');
const logger = require('./logger');
module.exports.updateWithdrawStatus = async function(req, res){
try {
    logger.info(successMessages.START);
    logger.info(successMessages.UPDATE_WITHDRAW_STATUS_ACTIVATED)
    //input user ID
    const id = req.params.id || req.body.id || req.query.id || req.headers["id"];
    logger.info(`ID - ${id}`)
    const {status , comment} = req.body;
    //check for ID available or not
    if(!id){
        logger.error(errorMessages.UNIQUE_ID_MISSING)
        return res.status(400).json(errorMessages.UNIQUE_ID_MISSING)
    }
    //define the status
    // const status = "completed";
    if(status == 'Completed'){
        try {
            //update the status in DB
            const updateData = await History.findOneAndUpdate({transactionId:id},{status},{new:true})
            if(updateData){
                logger.info(`Output - ${updateData}`)
                logger.info(successMessages.END);
                return res.status(200).json(updateData)
            }else{
                logger.error(errorMessages.NOT_FOUND)
                return res.status(404).json(errorMessages.NOT_FOUND)
            }
        } catch (error) {
            logger.error(error);
            return res.status(502).json(errorMessages.BAD_GATEWAY)
        }
    }else if(status == 'Failed'){
        if(!comment){
            logger.error(errorMessages.COMMENT_REQUIRED);
            return res.status(400).json(errorMessages.COMMENT_REQUIRED)
        }else{
            try {
                //update the status in DB
                const updateData = await History.findOneAndUpdate({transactionId:id},{status,comment},{new:true})
                if(updateData){
                    logger.info(`Output - ${updateData}`)
                    logger.info(successMessages.END);
                    return res.status(200).json(updateData)
                }else{
                    logger.error(errorMessages.NOT_FOUND)
                    return res.status(404).json(errorMessages.NOT_FOUND)
                }
            } catch (error) {
                logger.error(error);
                return res.status(502).json(errorMessages.BAD_GATEWAY)
            }
        }
    }

} catch (error) {
    logger.error(errorMessages.UPDATED_WITHDRAW_STATUS_FAILED)
    return res.status(errorMessages.INTERNAL_ERROR)
}
    
}