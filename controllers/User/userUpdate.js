const User = require('../../models/User');
const verifyUser = require('../../middleware/verifyUser');
const logger = require('./logger');
const errorMessages = require('../../response/errorMessages');
const successMessages = require('../../response/successMessages');
module.exports.userUpdate = async function(req, res){
    try {
        logger.info(successMessages.USER_UPDATED_ACTIVATED)
        logger.info(`Input - ${req.body}`)
        //check for Body input
        if(!req.body){
            res.status(400).json(errorMessages.INVALID_INPUT)
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
            logger.error(errorMessages.NOT_FOUND)
            return res.status(404).json(errorMessages.NOT_FOUND)
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
                logger.error(errorMessages.USER_DOES_NOT_EXIST)
                res.status(404).json(errorMessages.USER_DOES_NOT_EXIST)
            }
        }else{
            logger.error(errorMessages.ACCESS_DENIED)
            res.status(401).json(errorMessages.ACCESS_DENIED)
        }
       

    } catch (error) {
        logger.error(errorMessages.USER_UPDATE_FAILED)
        res.status(500).json(errorMessages.INTERNAL_ERROR)
    }
}