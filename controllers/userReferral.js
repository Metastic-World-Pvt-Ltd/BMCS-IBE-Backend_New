const User = require('../models/User');
const Wallet = require('../models/Wallet');
const History = require('../models/History');
const logger = require('./logger');
module.exports.userReferral = async function(req, res){
    try {
        //input data of user
        logger.info(`Acivated user Referral Endpoint`)
        logger.info(`Input - ${req.body}`)
        const contact = req.body.contact || req.query.contact || req.headers["contact"];
        const amount = req.body.amount || req.query.amount || req.headers["amount"];
       //level limit to distribute referral comission
        const maxLimit = 15;
        //check user input
        if(!contact || !amount){
            logger.error(`All fields are required`)
           res.status(400).json('All fields are required')
        }else{
       //check contact in database 
       const data = await User.findOne({contact});
       //console.log(data);
       logger.info(`User Foun din DB`)
       //check if no data found in DB
       if(data == null){
        logger.error(`Record not found`)
         return res.status(404).json('Record not found')
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
                 logger.info(`NO Parent data found`)
                 return res.status(404).json('No Parent data found')
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
                        const origin = 'referralEarning';
                        const userHistory = await History.create({
                            contact,
                            transactionAmount,
                            type,
                            origin,
                        })  
                        logger.info(`History genrated ${userHistory}`)
                      //update user wallet amount        
                      const data = await Wallet.findByIdAndUpdate({_id:id},{
                          contact,
                          projectEarning,
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
                        const origin = 'referralEarning';
                        const userHistory = await History.create({
                            contact,
                            transactionAmount,
                            type,
                            origin,
                        })
                        logger.info(`History genrated ${userHistory}`)
                      //create new DB document 
                      const walletData = await Wallet.create({
                          contact,
                          projectEarning,
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
                        logger.info(`Path completed , NO More Data Available`)
                         return res.json('Path completed , NO More Data Available');
                     }
                  //console.log(parent);
             }
 
         }
     
         res.json("data");
       }
 
        } 
 } catch (error) {
    logger.error(`User Referral Endpoint Failed`)
     res.status(500).json('Something went wrong in referral earning page')
 }
}