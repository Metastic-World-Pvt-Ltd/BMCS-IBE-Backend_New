const User = require("../../models/User");
const History = require('../../models/History');
const errorMessages = require("../../response/errorMessages");
const logger = require("./logger");
const successMessages = require("../../response/successMessages");

module.exports.totalRef = async function(req , res){
    try {
      logger.info(successMessages.START);
      logger.info(successMessages.ACTIVATED_TOTAL_REF_ACTIVATED);
      const contact = req.params.contact || req.body.contact || req.query.contact || req.headers["contact"];
      const origin_name = req.headers["origin-name"];
      logger.info(`Input - ${contact}, ${origin_name}`);

      if(!contact || !origin_name){
          return res.status(400).json(errorMessages.ALL_FIELDS_REQUIRED);
      }
  
      const isExist = await User.findOne({contact});

      if(!isExist){
        logger.error(errorMessages.NOT_FOUND)
        return res.status(404).json(errorMessages.NOT_FOUND);
    }

      const referralEarningCriteria = {
          'origin': origin_name,
          'contact': contact // Replace with the actual field for user contact number
        };
        try {
                    //   //find in DB and return sum
            var data = await History.aggregate([
              {$match: referralEarningCriteria},
              {$group:{ _id: null, totalAmount: { $sum: '$transactionAmount' } }}
            ])
            //if no record found
            console.log("Data",data);
            if(data.length == 0){
              var amount = 0;
            }else{
                  amount = data[0].totalAmount;
            }
              
        
            return res.status(200).json({amount});
        } catch (error) {
          logger.error(error);
            return res.status(502).json(errorMessages.BAD_GATEWAY)
        }
    } catch (error) {
      logger.error(errorMessages.TOTAL_REF_FAILED)
      return res.status(500).json(errorMessages.INTERNAL_ERROR);
    }

}