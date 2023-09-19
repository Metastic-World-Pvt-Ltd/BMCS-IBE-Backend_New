const History = require('../../models/History');
const errorMessages = require('../errorMessages');
const successMessages = require('../successMessages');
const logger = require('./logger');

module.exports.userHistory = async  function(req, res){
try {
    
    logger.info(successMessages.USER_HISTORY_ACTIVATED)
    //input data of user
    const contact = req.body.contact || req.query.contact || req.headers["contact"];
    logger.info(`Input - ${contact}`)
    //check for contact is provided or not
    if(!contact){
        logger.error(errorMessages.COMMENT_REQUIRED)
        res.status(400).json(errorMessages.COMMENT_REQUIRED)
    }else{
        //check history by contact in DB
        const userHist = await History.find({contact});
        //if no data in DN return msg
        if(userHist.length == 0){
            logger.error(errorMessages.NOT_FOUND)
            res.status(404).json(errorMessages.NOT_FOUND)
        }else{
            //found the data in DB
            logger.info(`Ouptput - ${userHist}`)
            res.status(200).json(userHist);
        }
    }
} catch (error) {
    logger.error(errorMessages.GET_USER_FAILED)
    res.status(500).json(errorMessages.INTERNAL_ERROR)
}

}