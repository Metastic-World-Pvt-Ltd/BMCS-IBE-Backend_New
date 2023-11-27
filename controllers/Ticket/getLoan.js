const Loan = require('../../models/Loan');
const errorMessages = require('../../response/errorMessages');
const successMessages = require('../../response/successMessages');
const logger = require('../User/logger');

module.exports.getLoan = async function(req , res){
try {
    logger.info(successMessages.START);
    logger.info(successMessages.GET_LOAN_ACTIVATED);
    const contact = req.headers['contact'];
    
    var data ;
    if(contact){
        data = await Loan.find({contact});
    }else{
        data = await Loan.find();
    }
    try {

        if(data){
            logger.info(successMessages.DATA_SEND_SUCCESSFULLY)
            return res.status(200).json({'Data':data})
        }else{
            logger.info(errorMessages.NOT_FOUND)
            return res.status(404).json(errorMessages.NOT_FOUND)
        }
    } catch (error) {
        logger.error(error)
        return res.status(502).json(errorMessages.BAD_GATEWAY)
    }
} catch (error) {
    logger.error(errorMessages.GET_LOAN_FAILED);
    return res.status(500).json(errorMessages.INTERNAL_ERROR)
}
}