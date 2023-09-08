const History = require('../../models/History');
const logger = require('./logger')
module.exports.totalEarning = async function(req, res){
try {
    logger.info(`Activated Total Earning Endpoint`)
    //user input to find  all earning with origin
    const {contact , origin} = req.body;
    //check for data 
    if(!contact || !origin){
        logger.info(`All Fileds are required`)
        return re.status('All Fileds are required');
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
        logger.error(`No Record Found`)
        return res.status(404).json("No Record Found")
      }else{
        logger.info(data)
        return res.status(200).json(data)
      }
} catch (error) {
    logger.error(`Total Earning Endpoint Failed`)
    return res.status(`Something went wrong in total earning`)
}
}