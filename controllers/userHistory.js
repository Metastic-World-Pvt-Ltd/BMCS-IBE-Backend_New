const History = require('../models/History');
const logger = require('./logger');

module.exports.userHistory = async  function(req, res){
try {
    //input data of user
    logger.info(`Activated Transaction History Endpoint`)

    const contact = req.body.contact || req.query.contact || req.headers["contact"];
    logger.info(`Input - ${contact}`)
    if(!contact){
        logger.error(`Please provide contact`)
        res.status(400).json('Please provide contact')
    }else{
        const userHist = await History.find({contact});
        if(userHist.length == 0){
            logger.error(`No Record Found`)
            res.status(404).json('No record found')
        }else{
            logger.info(`Ouptput - ${userHist}`)
            res.status(200).json(userHist);
        }
    }
} catch (error) {
    logger.error(`User History Endpoint Failed`)
    res.status(500).json('Something went wrong in fetching user transaction History')
}

}