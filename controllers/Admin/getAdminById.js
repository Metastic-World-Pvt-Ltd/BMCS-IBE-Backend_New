const AdminUser = require('../../models/AdminUser');
const errorMessages = require('../../response/errorMessages');
const successMessages = require('../../response/successMessages');
const logger = require('../User/logger');

module.exports.getAdminBYId = async function(req , res){
try {
    logger.info(successMessages.START);
    logger.info(successMessages.GET_ADMIN_BYID_ACTIVATED);
    const adminId = req.headers['id'];

    if(!adminId){
        logger.error(errorMessages.ALL_FIELDS_REQUIRED)
        return res.status(400).json(errorMessages.ALL_FIELDS_REQUIRED);
    }

    try {
        const data = await AdminUser.findOne({adminId},{password:0});

        if(data){
            logger.info(successMessages.DATA_SEND_SUCCESSFULLY)
            logger.info(successMessages.END);
            return res.status(200).json(data);
        }else{
            logger.info(successMessages.END);
            return res.status(404).json(errorMessages.NOT_FOUND);
        }
    } catch (error) {
        logger.info(successMessages.END);
        return res.status(502).json(errorMessages.BAD_GATEWAY)
    }
} catch (error) {
    logger.error(errorMessages.GET_ADMIN_BYID_FAILED)
    logger.info(successMessages.END);
    return res.status(500).json(errorMessages.INTERNAL_ERROR)
}
}