const User = require('../../models/User');
const errorMessages = require('../../response/errorMessages');
const successMessages = require('../../response/successMessages');
const logger = require('./logger');

module.exports.getRefChild = async function(req, res){
// try {
    logger.info(`Start`);
    logger.info(successMessages.GET_REF_CHILD_ACTIVATED);
    //define array to store referral
    const stack = [];
    var levelCount = [] ;
    var referral;
   
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
    console.log(item.length);
    levelCount.push(item.length) ;

    var length = item.length ;
    for(let i=0;i <length ; i++){
        const refConact = item[i].contact;
         referral = await User.find({refBy:refConact})
         if(item.length == i){
            length = referral.length;
         }
        levelCount.push(referral.length);
       // console.log("referral Data",referral);
    }
    
    if(item.length == 0){
        logger.error(`Error - ${errorMessages.NOT_FOUND}`);
        return res.status(404).json(errorMessages.NOT_FOUND);
    }
    

    // try {     
        //define method to push records in to array          
        var i=0;
        while(i < item.length){
            stack.push(item[i].contact)
    
            // if(item[i].level == '1'){
            //     levelCount1.push(item[i].level)
            // }else if(item[i].level == '2'){
            //     levelCount2.push(item[i].level)
            // }
            // else if(item[i].level == '3'){
            //     levelCount3.push(item[i].level)
            // }
            
            i++;

        }
            // const child = item[i].contact;
            
            for(let i=0;i<item.length;i++){
                // console.log(`Chil data here 1`);
                // console.log("Next child",item[i].contact );
                const child = item[i].contact;
                const data = await User.find({refBy:child});
                // console.log(data);
                // console.log(`Chil data here 2`);
            }

            
        // console.log(lngth);
        logger.info(`Output - [${stack}]`) 
        logger.info(`End`);
        //success response 
        return res.status(200).json({stack, levelCount:levelCount })
    // } catch (error) {
    //     //error handeled here
    //     logger.error(`Error - ${errorMessages.SOMETHING_WENT_WRONG}`);
    //     return res.json(errorMessages.SOMETHING_WENT_WRONG);
    // }
// } catch (error) {
//     //Endpoint Failure Error Handeled here
//     logger.error(`Error - ${errorMessages.GET_REF_CHILD_FAILED}`);
//     return res.status(500).json(errorMessages.INTERNAL_ERROR);
// }
}