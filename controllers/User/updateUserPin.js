const PIN = require('../../models/PIN');
const errorMessages = require('../../response/errorMessages');
const successMessages = require('../../response/successMessages');
const logger = require('./logger');
const bcrypt = require('bcryptjs');
module.exports.updateUserPin = async function(req, res){

try {
    logger.info(successMessages.UPDATE_USER_PIN_ACTIVATED);
    logger.info(successMessages.START);
    //User Input
    const {contact , pin} = req.body;
    logger.info(`Input - ${contact} , ${pin}`)
    //check for required Fields
    if(!contact || !pin){
        logger.error(`Error - ${errorMessages.ALL_FIELDS_REQUIRED}`)
        return res.status(400).json(errorMessages.ALL_FIELDS_REQUIRED);
    }
    //check userexist or not
    const isExist = await PIN.findOne({contact});
    
    if(isExist){
        //get ID to update PIN
        const _id = isExist._id;
        //decrypt PIN and match entered PIN by user
        const decode = bcrypt.compareSync(pin , isExist.PIN);
        //check if PIN is same ot not
        if(decode){ 
            //error
            logger.error(errorMessages.RECORD_ALREADY_EXIST)
            return res.status(422).json(errorMessages.RECORD_ALREADY_EXIST)
        }
        try {
            //update Record into DB
            const updatePin = await PIN.findByIdAndUpdate({_id},{PIN:pin},{new:true});
            updatePin.save();
            
            logger.info(successMessages.END)
            //response
            return res.status(200).json(successMessages.RECORD_UPDATED_SUCCESSFULLY);
        } catch (error) {
            //error
            logger.error(`Error - ${error}`);
            return res.json(errorMessages.SOMETHING_WENT_WRONG)
        }
    }else{
        //error
        logger.error(errorMessages.NOT_FOUND)
        return res.status(404).json(errorMessages.NOT_FOUND);
    }
} catch (error) {
    //error
    logger.error(errorMessages.INTERNAL_ERROR)
    return res.status(500).json(errorMessages.INTERNAL_ERROR);
}
}