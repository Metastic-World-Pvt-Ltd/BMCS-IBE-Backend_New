const User = require('../../models/User');
const verifyUser = require('../../middleware/verifyUser');
const logger = require('./logger');
module.exports.userUpdate = async function(req, res){
    try {
        logger.info(`Activated userUpdate Endpoint`)
        logger.info(`Input - ${req.body}`)
        //check for Body input
        if(!req.body){
            res.status(400).json('Enter valid field to update details')
        }
        logger.info(`req.params.id - ${req.params.id}`)
        //check for user ID to update
        const _id = req.params.id;
        //middleware to check user authorized or not
        const middlewareData = verifyUser.data;
        //check data exist in DB or not
        const findData = await User.findById({_id});
        logger.info(`Midderlware Data ${middlewareData}`)
        logger.info(`output - ${findData}`)
        if(findData == null){
            logger.error(`No Record Found`)
            return res.status(404).json(`No Record Found`)
        }
        // console.log(middlewareData);
        // console.log(findData);
        //check id authorized token then only user can update details
        if(middlewareData.contact == findData.contact && middlewareData.firstName == findData.firstName){
            //check and update user deatils in DB
            const updateData =  await User.findByIdAndUpdate(_id,req.body,{new:true});
            if(updateData){
                //response 
                logger.info(`updated output - ${updateData}`)
                res.status(200).json(updateData);
            }else{
                logger.error(`User does not exist`)
                res.status(404).json('User does not exist')
            }
        }else{
            logger.error(`seems you do not have access to perform this action`)
            res.status(401).json('seems you do not have access to perform this action')
        }

        

    } catch (error) {
        logger.error(`User update Endpoint Failed`)
        res.status(500).json('Something went wrong in updating user')
    }
}