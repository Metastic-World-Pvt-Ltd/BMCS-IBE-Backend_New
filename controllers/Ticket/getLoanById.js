const Loan = require('../../models/Loan');
const errorMessages = require('../../response/errorMessages');
const successMessages = require('../../response/successMessages');
const logger = require('../User/logger');

module.exports.getLoanById = async function(req , res){
try {    
    logger.info(successMessages.START);
    logger.info(successMessages.GET_LOAN_BY_ID_ACTIVATED)

    const id =  req.headers['id'];

    if(!id){
        logger.error(errorMessages.ALL_FIELDS_REQUIRED);
        return res.status(400).json(errorMessages.ALL_FIELDS_REQUIRED)
    }

    try {
        const data = await Loan.findOne({ticketId:id});

        if(!data){
            logger.error(errorMessages.NOT_FOUND);
            return res.status(404).json(errorMessages.NOT_FOUND)
        }
    
        return res.status(200).json(data);
    } catch (error) {
        logger.error(error);
        return res.status(502).json(errorMessages.BAD_GATEWAY);
    }

    
} catch (error) {
    logger.error(error)
    logger.error(errorMessages.GET_LOAN_BY_ID_FAILED)
    return res.status(500).json(errorMessages.INTERNAL_ERROR)
}    
}