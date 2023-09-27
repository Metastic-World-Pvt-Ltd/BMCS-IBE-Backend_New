const TicketHistory = require('../../models/TicketHistory');
const errorMessages = require('../../response/errorMessages');
const successMessages = require('../../response/successMessages');
const logger = require('../User/logger');

module.exports.getTicketHistory =  async function(req, res){
try {
    logger.info(successMessages.GET_TICKET_HISOTRY_ACTIVATED);
    logger.info(successMessages.START);
    const id = req.params.id || req.body.id || req.query.id || req.headers["id"];

    if(!id){
        logger.error(errorMessages.TIKCET_ID_REQUIRED);
        return res.status(400).json(errorMessages.TIKCET_ID_REQUIRED);
    }

    const tktHistData = await TicketHistory.find({ticketId:id});
    if(tktHistData.length == 0){
        logger.error(errorMessages.NOT_FOUND)
        return res.status(404).json(errorMessages.NOT_FOUND);
    }else{
        logger.info(`Output - ${tktHistData}`)  
        logger.info(successMessages.END);
        return res.status(200).json(tktHistData);
    }
} catch (error) {
    logger.error(errorMessages.GET_TICKET_HISTORY_FAILED);
    return res.status(500).json(errorMessages.INTERNAL_ERROR);
}

}