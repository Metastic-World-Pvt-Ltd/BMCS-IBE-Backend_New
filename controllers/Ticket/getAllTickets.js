const Loan = require('../../models/Loan');
const AMC = require('../../models/AMC');
const Fund = require('../../models/Fund');
const errorMessages = require('../../response/errorMessages');
const successMessages = require('../../response/successMessages');
const logger = require('../User/logger');

module.exports.getAllTickets =  async function(req, res){
    var data = [];
    logger.info(successMessages.GET_ALL_TICKETS_ACTIVATED)
    logger.info(successMessages.START);
    try {
        const loan = await Loan.find();
        data.push(loan);
        const amc = await AMC.find();
        data.push(amc);
        const fund = await Fund.find();
        data.push(fund)
    } catch (error) {
        logger.error(error)
        return res.status(502).json(errorMessages.BAD_GATEWAY)
    }
    
    if(!data){
        logger.info(errorMessages.NOT_FOUND);
        return res.status(404).json(errorMessages.NOT_FOUND);
    }
    logger.info(`Output - ${data}`);
    logger.info(successMessages.END);
    res.status(200).json(data);
     data = [];
    return;

}