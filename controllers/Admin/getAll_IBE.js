const User =  require('../../models/User');
const errorMessages = require('../../response/errorMessages');
const successMessages = require('../../response/successMessages');
const logger = require('../User/logger');

module.exports.getAll_IBE = async function(req , res){

    const userStatus = req.headers['status'];
    const setPin = req.headers['pin-status'];
    const isKyc = req.headers['kyc-status'];
    
    if(userStatus){
       try {
            const data = await User.find({userStatus});
            if(data.length == 0){
                logger.error(errorMessages.NOT_FOUND)
                return res.status(404).json(errorMessages.NOT_FOUND); 
            }else{
                logger.info(successMessages.DATA_SEND_SUCCESSFULLY)
                return res.status(200).json(data);
            }
       } catch (error) {
            logger.error(error)
            return res.status(502).json(errorMessages.BAD_GATEWAY)
       }
    }else if(setPin){
        try {
            const data = await User.find({setPin});
            if(data.length == 0){
                logger.error(errorMessages.NOT_FOUND)
                return res.status(404).json(errorMessages.NOT_FOUND); 
            }else{
                logger.info(successMessages.DATA_SEND_SUCCESSFULLY)
                return res.status(200).json(data);
            }
       } catch (error) {
            logger.error(error)
            return res.status(502).json(errorMessages.BAD_GATEWAY)
       }
    }else if(isKyc){
        try {
            const data = await User.find({isKyc});
            if(data.length == 0){
                logger.error(errorMessages.NOT_FOUND)
                return res.status(404).json(errorMessages.NOT_FOUND); 
            }else{
                logger.info(successMessages.DATA_SEND_SUCCESSFULLY)
                return res.status(200).json(data);
            }
       } catch (error) {
            logger.error(error)
            return res.status(502).json(errorMessages.BAD_GATEWAY)
       }
    }else{
        try {
            const data = await User.find();
            if(data.length == 0){
                logger.error(errorMessages.NOT_FOUND)
                return res.status(404).json(errorMessages.NOT_FOUND); 
            }else{
                logger.info(successMessages.DATA_SEND_SUCCESSFULLY)
                return res.status(200).json(data);
            }
       } catch (error) {
            logger.error(error)
            return res.status(502).json(errorMessages.BAD_GATEWAY)
       }
    }
    

    
}