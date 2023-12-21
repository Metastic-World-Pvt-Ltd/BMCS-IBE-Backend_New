const User =  require('../../models/User');
const errorMessages = require('../../response/errorMessages');
const successMessages = require('../../response/successMessages');
const logger = require('../User/logger');

module.exports.getAll_IBE = async function(req , res){

    const userStatus = req.headers['status'];
    const setPin = req.headers['pin-status'];
    const isKyc = req.headers['kyc-status'];
    const page = parseInt(req.query.page) || 1;
    const limit = 8;

    if(userStatus){
       try {
            const countData = await User.find({userStatus});
            const count = countData.length;

            const data = await User.find({userStatus})
            .skip((page - 1) * limit)
            .limit(limit);

            if(data.length == 0){
                logger.error(errorMessages.NOT_FOUND)
                return res.status(404).json(errorMessages.NOT_FOUND); 
            }else{
                logger.info(successMessages.DATA_SEND_SUCCESSFULLY)
                return res.status(200).json({
                    page,
                    totalPages: Math.ceil(count / limit),
                    'IBE_Users':data
                });
            }
       } catch (error) {
            logger.error(error)
            return res.status(502).json(errorMessages.BAD_GATEWAY)
       }
    }else if(setPin){
        try {
            const countData = await User.find({setPin});
            const count = countData.length;

            const data = await User.find({setPin})
            .skip((page - 1) * limit)
            .limit(limit);

            if(data.length == 0){
                logger.error(errorMessages.NOT_FOUND)
                return res.status(404).json(errorMessages.NOT_FOUND); 
            }else{
                logger.info(successMessages.DATA_SEND_SUCCESSFULLY)
                return res.status(200).json({
                    page,
                    totalPages: Math.ceil(count / limit),
                    'IBE_Users':data
                });
            }
       } catch (error) {
            logger.error(error)
            return res.status(502).json(errorMessages.BAD_GATEWAY)
       }
    }else if(isKyc){
        try {
            const countData = await User.find({isKyc});
            const count = countData.length;

            const data = await User.find({isKyc})
            .skip((page - 1) * limit)
            .limit(limit);

            if(data.length == 0){
                logger.error(errorMessages.NOT_FOUND)
                return res.status(404).json(errorMessages.NOT_FOUND); 
            }else{
                logger.info(successMessages.DATA_SEND_SUCCESSFULLY)
                return res.status(200).json({
                    page,
                    totalPages: Math.ceil(count / limit),
                    'IBE_Users':data
                });
            }
       } catch (error) {
            logger.error(error)
            return res.status(502).json(errorMessages.BAD_GATEWAY)
       }
    }else{
        try {
            const countData = await User.find();
            const count = countData.length;

            const data = await User.find()
            .skip((page - 1) * limit)
            .limit(limit);
            
            if(data.length == 0){
                logger.error(errorMessages.NOT_FOUND)
                return res.status(404).json(errorMessages.NOT_FOUND); 
            }else{
                logger.info(successMessages.DATA_SEND_SUCCESSFULLY)
                return res.status(200).json({
                    page,
                    totalPages: Math.ceil(count / limit),
                    'IBE_Users':data
                });
            }
       } catch (error) {
            logger.error(error)
            return res.status(502).json(errorMessages.BAD_GATEWAY)
       }
    }
    

    
}