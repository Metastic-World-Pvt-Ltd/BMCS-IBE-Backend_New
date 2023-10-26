const AdminUser = require('../../models/AdminUser');
const logger = require('../User/logger');
require('dotenv').config({path:'../../.env'});
const jwt = require('jsonwebtoken');
const DeletedUser =  require(`../../models/DeletedUser`);
const errorMessages = require('../../response/errorMessages');
const successMessages = require('../../response/successMessages');

module.exports.deleteAdmin = async function(req, res){
try {
    logger.info(`Start`);
    logger.info(successMessages.DELETE_ADMIN_ACTIVATED)
    const {email} = req.body;
    logger.info(`email - ${email}`)
    const token = req.body.token || req.query.token || req.headers["x-access-token"];
    // logger.info(`Token - ${token } `)
    //check for token provided or not
    if(!token){
        logger.error(errorMessages.TOKEN_NOT_FOUND)
        return res.status(401).json(errorMessages.TOKEN_NOT_FOUND);
    }
    if(!email){
        logger.error(errorMessages.EMAIL_REQUIRED)
        return res.status(400).json(errorMessages.EMAIL_REQUIRED)
    }
    var userRole;
    var decode;
    try {
        //decode token signature
        const secret = process.env.SECRET_KEY;
         decode = jwt.verify(token , secret);
        console.log(decode);
    //check for user role as per token
         userRole = decode.role;
         var deletedBy = decode.email;
    } catch (error) {
        logger.error(errorMessages.TOKEN_EXPIRED);
        return res.status(401).json(errorMessages.TOKEN_EXPIRED)
    }
    const _id = decode.id;
    const adminEmail = decode.email;
    const activeUser = await AdminUser.findById({_id})
    
    if(activeUser == null){
        logger.error(`In active Admin`)
        return res.status(401).json(errorMessages.ACCESS_DENIED)
    }
    logger.info(`User Role - ${userRole}`)
    //check for authorization
    if(userRole == "Super_Admin" || userRole == "super_admin"){
        const isExist = await AdminUser.findOne({email});
        logger.info(`User In DB - ${isExist}`)
        if(isExist == null){
            logger.error(errorMessages.NOT_FOUND)
            return res.status(404).json(errorMessages.NOT_FOUND)
        }
        try {
            const deleteData = await AdminUser.findOneAndDelete({email});
            const DeletedHist = await DeletedUser.create({
                name:isExist.name,
                email:isExist.email,
                role:isExist.role,
                deletedBy:adminEmail,
            })
            
            logger.info(successMessages.DELETED_USER_SUCCESS +' ' + deleteData)
            logger.info(`End`);
            return res.status().json(successMessages.DELETED_USER_SUCCESS)
        } catch (error) {
            logger.error(`Error -${error}`)
            return res.json(errorMessages.SOMETHING_WENT_WRONG)
        }

    }else{
        logger.error(errorMessages.ACCESS_DENIED)
        return res.status(403).json(errorMessages.ACCESS_DENIED)
    }

} catch (error) {
    logger.error(errorMessages.DELETE_ADMIN_FAILED);
    return res.status(500).json(errorMessages.INTERNAL_ERROR)
}

}