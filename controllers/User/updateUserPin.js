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
    const {contact , oldPin ,newPin } = req.body;
    logger.info(`Input - ${contact} , ${oldPin}, ${newPin}`)
    //check for required Fields
    if(!contact || !oldPin || !newPin){
        logger.error(`Error - ${errorMessages.ALL_FIELDS_REQUIRED}`)
        return res.status(400).json(errorMessages.ALL_FIELDS_REQUIRED);
    }
    //check userexist or not
    const isExist = await PIN.findOne({contact});
    
    if(isExist){       
        //decrypt PIN and match entered PIN by user
        const decode = bcrypt.compareSync(oldPin , isExist.PIN);
        //check if PIN is same ot not
        if(decode){ 
          
            const matchPin = bcrypt.compareSync(newPin , isExist.PIN);
            if(matchPin){
                //error
                logger.error(errorMessages.SAME_PIN_EXIST)
                return res.status(422).json(errorMessages.SAME_PIN_EXIST)
            }else{
                try {
                    //update Record into DB
                    const updatePin = await PIN.findOneAndUpdate({contact},{PIN:newPin},{new:true});
                    updatePin.save();
                    
                    logger.info(successMessages.END)
                    //response
                    return res.status(200).json(successMessages.RECORD_UPDATED_SUCCESSFULLY);
                } catch (error) {
                    //error
                    logger.error(`Error - ${error}`);
                    return res.json(errorMessages.SOMETHING_WENT_WRONG)
                }
            }

        }else{
            return res.status(400).json(errorMessages.INCORRECT_OLD_PIN)
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