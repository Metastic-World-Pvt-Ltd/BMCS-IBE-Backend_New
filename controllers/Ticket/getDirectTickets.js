const Ticket = require('../../models/Ticket');
const errorMessages = require('../../response/errorMessages');
const successMessages = require('../../response/successMessages');
const logger = require('../User/logger');

module.exports.getDirectTickets =  async function(req, res){
    logger.info(successMessages.GET_DIRECT_TICKET)
    logger.info(successMessages.START);
    const data = await Ticket.find({refBy:'Admin'});
    if(!data){
        logger.info(errorMessages.NOT_FOUND);
        return res.status(404).json(errorMessages.NOT_FOUND);
    }
    logger.info(`Output - ${data}`);
    logger.info(successMessages.END);
    return res.status(200).json(data);
}