const Loan = require('../../models/Loan');
const errorMessages = require('../../response/errorMessages');
const successMessages = require('../../response/successMessages');
const logger = require('../User/logger');

module.exports.getAllTickets =  async function(req, res){
    logger.info(successMessages.GET_ALL_TICKETS_ACTIVATED)
    logger.info(successMessages.START);
    const data = await Loan.find();
    if(!data){
        logger.info(errorMessages.NOT_FOUND);
        return res.status(404).json(errorMessages.NOT_FOUND);
    }
    logger.info(`Output - ${data}`);
    logger.info(successMessages.END);
    return res.status(200).json(data);
}