const SupportTicket = require('../../models/SupportTicket');
const errorMessages = require('../../response/errorMessages');
const successMessages = require('../../response/successMessages');
const logger = require('../User/logger');

module.exports.getAllSupportTicket = async function(req , res){
    try {
        logger.info(successMessages.GET_ALL_SUPPORT_TICKET);
        logger.info(successMessages.START);

        const data = await SupportTicket.find();
        logger.info(`Output - ${data}`)
        logger.info(successMessages.END)
        return res.status(200).json(data);
    } catch (error) {
        logger.error(errorMessages.GET_ALL_SUPPORT_TICKET_FAILED);
        return res.json(error);
    }
    
}