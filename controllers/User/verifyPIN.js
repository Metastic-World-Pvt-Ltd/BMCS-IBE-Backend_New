const PIN = require('../../models/PIN');
const bcrypt = require('bcryptjs');
const errorMessages = require('../../response/errorMessages');
const successMessages = require('../../response/successMessages');
const logger = require('../User/logger');
module.exports.verifyPIN = async function(req , res){
try {
    logger.info(successMessages.VERIFY_PIN_ACTIVATED);
    logger.info(successMessages.START);
    const {contact , pin} = req.body;
    logger.info(`Input - ${contact} , ${pin}`)
    if(!contact || !pin){
        logger.error(`Error - ${errorMessages.ALL_FIELDS_REQUIRED}`)
        return res.status(400).json(errorMessages.ALL_FIELDS_REQUIRED);
    }
    const isExist = await PIN.findOne({contact})
    if(isExist){
        const isMatch = await bcrypt.compare(pin , isExist.PIN)
        
        if(isMatch){
            logger.info(`Output - ${successMessages.VERIFIED_PIN_SUCCESSFULLY}`)
            return res.status(200).json(successMessages.VERIFIED_PIN_SUCCESSFULLY)
        }else{
            logger.error(`Error - ${errorMessages.ACCESS_DENIED}`)
            return res.status(401).json(errorMessages.ACCESS_DENIED)
        }
    }else{
        logger.error(`Error - ${errorMessages.NOT_FOUND}`)
        return res.status(404).json(errorMessages.NOT_FOUND);
    }
} catch (error) {
    logger.error(`Error -  ${errorMessages.VERIFY_PIN_FAILED}`)
    return res.status(500).json(errorMessages.INTERNAL_ERROR);
}
}