const History = require('../../models/History');
const errorMessages = require('../../response/errorMessages');
const successMessages = require('../../response/successMessages');
const logger = require('./logger')
module.exports.totalEarning = async function(req, res){
try {
    logger.info(`Start`);
    logger.info(successMessages.TOTAL_EARNING_ACTIVATED)
    //user input to find  all earning with origin
    const {contact , origin} = req.body;
    //check for data 
    if(!contact || !origin){
        logger.info(errorMessages.ALL_FIELDS_REQUIRED)
        return re.status(errorMessages.ALL_FIELDS_REQUIRED);
    }
    logger.info(`Input - ${contact , origin}`)
    const referralEarningCriteria = {
        'origin': origin,
        'contact': contact // Replace with the actual field for user contact number
      };
      //find in DB and return sum
      const data = await History.aggregate([
        {$match: referralEarningCriteria},
        {$group:{ _id: null, totalAmount: { $sum: '$transactionAmount' } }}
      ])
      //if no record found
      if(data.length == 0){
        logger.error(errorMessages.NOT_FOUND)
        return res.status(404).json(errorMessages.NOT_FOUND)
      }else{
        logger.info(`Output  - ${data}`)
        logger.info(`End`);
        return res.status(200).json(data)
      }
} catch (error) {
    logger.error(errorMessages.TOTAL_EARNING_FAILED)
    return res.status(errorMessages.INTERNAL_ERROR)
}
}