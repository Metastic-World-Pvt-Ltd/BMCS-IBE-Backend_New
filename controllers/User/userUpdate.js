const User = require('../../models/User');
const verifyUser = require('../../middleware/verifyUser');
const logger = require('./logger');
const errorMessages = require('../../response/errorMessages');
const successMessages = require('../../response/successMessages');
const mongoose =  require('mongoose');
module.exports.userUpdate = async function(req, res){
    try {
        logger.info(`Start`);
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
            //create mongo connetion
            const db = mongoose.connection;
        // List of collection names  to update
            const collectionNames = ['wallets', 'tickethistories', 'pins', 'kycs', 'histories', 'enquiries', 'clientproducts'];

            try {
                //travel to all the collections
                for (const collectionName of collectionNames) {
                const collection = db.collection(collectionName);

                // Specify the update operation
                const filter = {contact: middlewareData.contact}; // Your filter criteria to select documents for update
                //mention the filed to be updated
                const update = {
                    $set: {
                    contact: req.body.contact,
                    },
                };
                //updated filed in mentioned collection list
                const result = await collection.updateMany(filter, update);

                logger.info(`Updated ${result.modifiedCount} documents in ${collectionName}`);
                }
            } catch (err) {
                logger.error('Error :', err);
                return res.json(err)
            }
            //check and update user deatils in DB
            const updateData =  await User.findByIdAndUpdate(_id,req.body,{new:true});
            if(updateData){
                //response 
                logger.info(`updated output - ${updateData}`)
                logger.info(`End`);
                return res.status(200).json(updateData);
            }else{
                logger.error(errorMessages.USER_DOES_NOT_EXIST)
                return res.status(404).json(errorMessages.USER_DOES_NOT_EXIST)
            }
        }else{
            logger.error(errorMessages.ACCESS_DENIED)
            return res.status(401).json(errorMessages.ACCESS_DENIED)
        }
       
//handel API error 
    } catch (error) {
        logger.error(errorMessages.USER_UPDATE_FAILED)
        return res.status(500).json(errorMessages.INTERNAL_ERROR)
    }
}