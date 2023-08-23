const User = require('../models/User');
const verifyUser = require('../middleware/verifyUser');
const logger = require('./logger');
module.exports.userUpdate = async function(req, res){
    try {
        logger.info(`Activated userUpdate Endpoint`)
        logger.info(`Input - ${req.body}`)
        if(!req.body){
            res.status(400).json('Enter valid field to update details')
        }
        logger.info(`req.params.id - ${req.params.id}`)
        const _id = req.params.id;
        const middlewareData = verifyUser.data;
        const findData = await User.findById({_id});
        logger.info(`Midderlware Data ${middlewareData}`)
        logger.info(`output - ${findData}`)
        // console.log(middlewareData);
        // console.log(findData);
        
        if(middlewareData.contact == findData.contact && middlewareData.firstName == findData.firstName){
            const updateData =  await User.findByIdAndUpdate(_id,req.body,{new:true});
            if(updateData){
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