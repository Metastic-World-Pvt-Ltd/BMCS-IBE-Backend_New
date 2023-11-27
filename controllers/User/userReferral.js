const User = require('../../models/User');
const Wallet = require('../../models/Wallet');
const History = require('../../models/History');
const logger = require('./logger');
const errorMessages = require('../../response/errorMessages');
const successMessages = require('../../response/successMessages');
module.exports.userReferral = async function(req, res){
    try {
      logger.info(`Start`);
        //input data of user
        logger.info(successMessages.USER_REFERRAL_ACTIVATED)
        
        const contact = req.body.contact || req.query.contact || req.headers["contact"];
        const amount = req.body.amount || req.query.amount || req.headers["amount"];
       //level limit to distribute referral comission
       logger.info(`Input - ${contact} , ${amount}`)
        const maxLimit = 15;
        //check user input
        if(!contact || !amount){
            logger.error(errorMessages.ALL_FIELDS_REQUIRED)
           res.status(400).json(errorMessages.ALL_FIELDS_REQUIRED)
        }else{
       //check contact in database 
       const data = await User.findOne({contact});
       //console.log(data);
       logger.info(`User Found in DB - ${data}`)
       //check if no data found in DB
       if(data == null){
        logger.error(errorMessages.NOT_FOUND)
         return res.status(404).json(errorMessages.NOT_FOUND)
       }else{
         //store parent contact
         var parent = data.refBy;
         //console.log("Parent data",parent);
         for(let i =0;i<maxLimit; i++){
             //check for parent data
            const newdata = await User.findOne({contact:parent})
            logger.info(`Parent Data ${newdata}`)
             //console.log("new Data",newdata);
             //check if parent available or not in DB
             if(newdata == null){
                 logger.info(errorMessages.PARENT_DATA_NOT_FOUND)
                 return res.status(404).json(errorMessages.PARENT_DATA_NOT_FOUND)
             }else{
                 //define referral earning percentage
                 var percent = [20,10,3,2,1.5,1,0.5,0.25,0.25,0.25,0.25,0.25,0.25,0.25,0.25];
                 //store parent contact
                 const contact = newdata.contact;
                 //check user exist or not
                 const isExist = await Wallet.findOne({contact});
                 //console.log('checking user',isExist);
                
                  if(isExist){
                     //referral earning distribution logic
                     logger.info(`Distribute Earning`)
                      const referralEarning =  parseInt(isExist.referralEarning) + (amount * percent[i] / 100);     
                      const projectEarning = 0;
                      const totalEarning = projectEarning + referralEarning;
                      const id = isExist._id.toString();
                      //console.log('inside update fn',id);
                        //create history data for user
                        const transactionAmount = (amount * percent[i] / 100)
                       // console.log(transactionAmount);
                        const type = 'credit';
                        const origin = 'Referral';
                        const status = 'Completed'
                        const transactionId = 'REF' + Date.now(); 
                        const userHistory = await History.create({
                            contact,
                            transactionAmount,
                            type,
                            status,
                            origin,
                            transactionId,
                        })  
                        logger.info(`History genrated ${userHistory}`)
                      //update user wallet amount        
                      const data = await Wallet.findByIdAndUpdate({_id:id},{
                          contact,
                          referralEarning ,
                          totalEarning
                     })
                     logger.info(`User wallet amount updated ${data}`)
                     //console.log('data',data);
          
                     }else{
                     // console.log('inside create fn');
                      const referralEarning = (amount * percent[i] / 100);     
                      const projectEarning = 0;
                      const totalEarning = projectEarning + referralEarning;
                      //const id = isExist._id.toString();
                        //create history data for user
                        const transactionAmount = (amount * percent[i] / 100)
                       // console.log(transactionAmount);
                        const type = 'credit';
                        const origin = 'Referral';
                        const status = 'Completed'
                        const transactionId = 'REF' + Date.now(); 
                        const userHistory = await History.create({
                            contact,
                            transactionAmount,
                            type,
                            status,
                            origin,
                            transactionId,
                        })
                        logger.info(`History genrated ${userHistory}`)
                      //create new DB document 
                      const walletData = await Wallet.create({
                          contact,
                          projectEarning:[
                            {
                            pendingAmount:0,
                            withdrawableAmount:0,
                            }
                        ],
                          referralEarning ,
                          totalEarning
                     })
                     logger.info(`User wallet amount updated ${data}`)
                     //console.log(walletData);
                     }
                     //storing referal id to get next parent details
                     parent = newdata.refBy;
                     //check for Admin Level
                     if(parent == 'Admin'){
                        logger.info(successMessages.ADMIN_PATH_COMPLETED)
                        logger.info(`End`);
                         return res.json(successMessages.ADMIN_PATH_COMPLETED);
                     }
                  //console.log(parent);
             }
 
         }
     
         res.json("data");
       }
 
        } 
 } catch (error) {
    logger.error(errorMessages.USER_REFERRAL_FAILED)
     res.status(500).json(errorMessages.INTERNAL_ERROR)
 }
}