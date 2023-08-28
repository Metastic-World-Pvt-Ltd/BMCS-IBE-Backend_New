const History = require('../models/History');
const logger = require('./logger');
module.exports.allWithdrawRequest = async function(req, res){
try {
    //find all withdraw request
    logger.info(`Activated All Withdraw Endpoint`)
    const allData = await History.find({origin:'withdraw'});
    //check for records in DB
    if(allData.length == 0){
        logger.error(`No Records Available`)
        return res.status(`No Records Available`)
    }else{
        logger.info(`Output - ${allData}`)
        res.status(200).json(allData); 
    }
} catch (error) {
    logger.error(`All Withdraw Endpint Failed`)
    return res.status(500).json(`Something went wrong in all withdraw request `)
}
    
}