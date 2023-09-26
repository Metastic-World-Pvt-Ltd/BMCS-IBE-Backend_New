const Enquiry =  require('../../models/Enquiry');
const errorMessages = require('../../response/errorMessages');
const successMessages = require('../../response/successMessages');
const logger = require('../User/logger');

module.exports.getTicketById = async function(req , res){
    logger.info(successMessages.GET_TICKET_BY_ID_ACTIVATED);
    logger.info(successMessages.START);
    const _id = req.params.id || req.body.id || req.query.id || req.headers["id"];

    if(!_id){
        logger.error(errorMessages.UNIQUE_ID_MISSING);
        return res.status(400).json(errorMessages.UNIQUE_ID_MISSING);
    }
    const ticketData = await Enquiry.findById({_id});
    if(!ticketData){
        logger.error(errorMessages.NOT_FOUND);
        return res.status(404).json(errorMessages.NOT_FOUND);
    }
    logger.info(`Output - ${ticketData}`);
    logger.info(successMessages.END);
    return res.status(200).json(ticketData);
    

}