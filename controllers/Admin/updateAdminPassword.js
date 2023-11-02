const AdminUser = require('../../models/AdminUser');
const bcrypt = require('bcryptjs');
const errorMessages = require('../../response/errorMessages');
const successMessages = require('../../response/successMessages');
const logger = require('../User/logger');

module.exports.updateAdminPassword = async function(req , res){
// try {
    logger.info(successMessages.UPDATE_ADMIN_PASSWORD_ACTIVATED);
    logger.info(successMessages.START);
    const {email , newPassword , oldPassword} = req.body;
    logger.info(`Input - ${email}`)
    if(!email || !newPassword){
        logger.error(errorMessages.EMAIL_AND_NEWPASS_REQUIRED);
        return res.status(400).json(errorMessages.EMAIL_AND_NEWPASS_REQUIRED);
    }

    const adminData = await AdminUser.findOne({email});
    
    if(!adminData){
        logger.error(errorMessages.NOT_FOUND);
        return res.status(404).json(errorMessages.NOT_FOUND);
    }
    logger.info(`Db Email Output - ${adminData.email}`);
    const dbpassword = adminData.password;
    const decodedPassword = bcrypt.compareSync(oldPassword , dbpassword);
    if(decodedPassword){
        try {
            const data = await AdminUser.findOneAndUpdate({email},{password:newPassword},{new:true});
            logger.info(successMessages.RECORD_UPDATED_SUCCESSFULLY);
            logger.info(successMessages.END);
            return res.status(200).json(successMessages.RECORD_UPDATED_SUCCESSFULLY);
        } catch (error) {
            logger.error(`Error - ${error}`);
            return res.json(error)
        }
    }else{
        logger.error(errorMessages.OLD_PASSWORD_IS_INCORRECT);
        return res.status(404).json(errorMessages.OLD_PASSWORD_IS_INCORRECT);
    }
// } catch (error) {
//     logger.error(errorMessages.INTERNAL_ERROR);
//     return res.status(500).json(errorMessages.INTERNAL_ERROR)
// }

}