const User = require("../../models/User");
const History = require('../../models/History');
const errorMessages = require("../../response/errorMessages");
const logger = require("./logger");

module.exports.totalRef = async function(req , res){
    const contact = req.params.contact || req.body.contact || req.query.contact || req.headers["contact"];
    const origin = req.headers["origin"];
    console.log(contact);
    if(!contact || !origin){
        return res.status(422).json(errorMessages.ALL_FIELDS_REQUIRED);
    }

    const isExist = await User.findOne({contact});

    const referralEarningCriteria = {
        'origin': origin,
        'contact': contact // Replace with the actual field for user contact number
      };
    //   //find in DB and return sum
      var data = await History.aggregate([
        {$match: referralEarningCriteria},
        {$group:{ _id: null, totalAmount: { $sum: '$transactionAmount' } }}
      ])
      //if no record found
      if(data.length == 0){
        var amount = 0;
      }else{
            amount = data[0].totalAmount;
      }
        
      
    if(!isExist){
        return res.status(404).json(errorMessages.NOT_FOUND);
    }
    var refCount = isExist.refCount;
    var totalCount = parseInt(refCount);

    return res.status(200).json({totalCount,amount});

}