const History = require('../../models/History');
const logger = require('./logger');
const errorMessages = require('../../response/errorMessages');
const successMessages = require('../../response/successMessages');

module.exports.getHistory = async function(req, res){
try {
    logger.info(`Start`);
    logger.info(successMessages.GET_HISTORY_ACTIVATED)
    
    const id = req.params.id || req.body.id || req.query.id || req.headers["id"];
    logger.info(`ID - ${id}`)
    const allData = await History.findOne({transactionId:id})
    //console.log(allData);
    if(allData){
        logger.info(`Output - ${allData}`)
        logger.info(`End`);
        return res.status(200).json(allData)
    }else{
        logger.error(errorMessages.NOT_FOUND)
        return res.status(404).json(errorMessages.NOT_FOUND)
    }
} catch (error) {
    logger.error(errorMessages.GET_HISTORY_FAILED);
    return res.status(500).json(errorMessages.INTERNAL_ERROR)
 }
}