const { verifyAdminUser } = require('../../middleware/verifyAdminUser');
const AdminUser = require('../../models/AdminUser');
const errorMessages = require('../../response/errorMessages');
const successMessages = require('../../response/successMessages');
const logger = require('../User/logger');

module.exports.updateProfile = async function(req , res){
try {
    logger.info(successMessages.START);
    logger.info(successMessages.UPDATE_PROFILE_ACTIVATED);
    const adminId = req.headers['id'];
    // console.log(req.body);
    // console.log("adminId",adminId);
    if(!adminId){
        logger.error(errorMessages.ALL_FIELDS_REQUIRED)
        return res.status(400).json(errorMessages.ALL_FIELDS_REQUIRED)
    };

    try {
        const updateData =  await AdminUser.findOneAndUpdate({adminId},req.body,{new:true});

        if(updateData){
            logger.info(successMessages.RECORD_UPDATED_SUCCESSFULLY)
            logger.info(successMessages.END)
            return res.status(200).json(successMessages.RECORD_UPDATED_SUCCESSFULLY);
        }else{
            logger.error(errorMessages.NOT_FOUND)
            logger.info(successMessages.END)
            return res.status(404).json(errorMessages.NOT_FOUND);
        }
    } catch (error) {
        logger.error(error)
        logger.info(successMessages.END)
        return res.status(502).json(errorMessages.BAD_GATEWAY);
    }
} catch (error) {
    logger.error(errorMessages.UPDATE_PROFILE_FAILED)
    logger.info(successMessages.END)
    return res.status(500).json(errorMessages.INTERNAL_ERROR);
}
    
}