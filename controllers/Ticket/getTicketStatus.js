const Loan = require('../../models/Loan');
const errorMessages = require('../../response/errorMessages');
const successMessages = require('../../response/successMessages');
const logger = require('../User/logger');

module.exports.getTicketStatus =  async function(req, res){
    logger.info(successMessages.GET_TICKET_STATUS_ACTIVATED);
    logger.info(successMessages.START);
    const contact = req.headers['contact'];
    logger.info(`Input - ${contact}`);

    if(!contact){
        logger.error(errorMessages.CONTACT_IS_REQUIRED)
        return res.status(400).json(errorMessages.CONTACT_IS_REQUIRED);
    }
    try {
        const data = await Loan.findOne({contact});
        logger.info(`Output - ${data.projectStatus}`)
        res.status(200).json(data.projectStatus);
    } catch (error) {
        return res.json(error);
    }
}