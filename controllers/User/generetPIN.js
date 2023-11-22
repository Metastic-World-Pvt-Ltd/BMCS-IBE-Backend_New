const PIN = require('../../models/PIN');
const User = require('../../models/User');
const errorMessages = require('../../response/errorMessages');
const successMessages = require('../../response/successMessages');
const logger = require('./logger');

module.exports.generatePin = async function(req, res){
    logger.info(successMessages.START);
    const {contact , pin} = req.body;
    if(!contact || !pin){
        logger.error(errorMessages.ALL_FIELDS_REQUIRED)
        return res.status(400).json(errorMessages.ALL_FIELDS_REQUIRED);
    }
    const isExist = await PIN.findOne({contact})
    if(isExist){
        logger.error(errorMessages.CONTACT_ALREADY_EXIST)
        return res.status(422).json(errorMessages.CONTACT_ALREADY_EXIST);
    }
    const data =  new PIN({
        contact , PIN:pin , 
    })
    await data.save();
    const setPin =  'true';
    const userData =  await User.findOneAndUpdate({contact},{setPin},{new:true})

    logger.info(successMessages.RECORD_ADDED_SUCCESSFULLY)
    logger.info(successMessages.END)
    res.status(200).json(successMessages.RECORD_ADDED_SUCCESSFULLY)
}