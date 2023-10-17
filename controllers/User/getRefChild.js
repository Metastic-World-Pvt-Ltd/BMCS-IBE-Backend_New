const User = require('../../models/User');
const errorMessages = require('../../response/errorMessages');
const successMessages = require('../../response/successMessages');
const logger = require('./logger');

module.exports.getRefChild = async function(req, res){
try {
    logger.info(`Start`);
    logger.info(successMessages.GET_REF_CHILD_ACTIVATED);
    //define array to store referral
    const stack = [];
    //user Input
    const contact = req.headers['contact'];
    logger.info(`Input - ${contact}`);
    //check contact provided or not
    if(!contact){
        logger.error(`Error - ${errorMessages.CONTACT_IS_REQUIRED}`);
        return res.status(400).json(errorMessages.CONTACT_IS_REQUIRED);
    }
    //find the record in DB
    const item = await User.find({refBy:contact});
    //check record found or not
    if(item.length == 0){
        logger.error(`Error - ${errorMessages.NOT_FOUND}`);
        return res.status(404).json(errorMessages.NOT_FOUND);
    }

    try {     
        //define method to push records in to array          
        var i=0;
        while(i < item.length){
            stack.push(item[i].contact)
            i++;
        }
        
        logger.info(`Output - [${stack}]`) 
        logger.info(`End`);
        //success response 
        return res.status(200).json({count:i})
    } catch (error) {
        //error handeled here
        logger.error(`Error - ${errorMessages.SOMETHING_WENT_WRONG}`);
        return res.json(errorMessages.SOMETHING_WENT_WRONG);
    }
} catch (error) {
    //Endpoint Failure Error Handeled here
    logger.error(`Error - ${errorMessages.GET_REF_CHILD_FAILED}`);
    return res.status(500).json(errorMessages.INTERNAL_ERROR);
}
}