const AdminUser = require('../../models/AdminUser');
const jwt = require('jsonwebtoken');
require('dotenv').config({path:'../../.env'});
const bcrypt = require('bcryptjs');
const logger = require('../User/logger');
const errorMessages = require('../../response/errorMessages');
const successMessages = require('../../response/successMessages');
module.exports.resetPassword = async function(req, res){
try {
    logger.info(`Start`);
    logger.info(successMessages.RESET_PASSWORD_ACTIVATED)
    //input token from iser
    const token = req.body.token || req.query.token || req.headers["x-access-token"];
    
    //input email and password
    const {email, password} = req.body;
    logger.info(`Input - ${email}, ${password}`);
    //check for token provided or not
    if(!token){
        return res.status(403).json(errorMessages.TOKEN_NOT_FOUND);
    }
    var userRole;
    try {
        //decode token signature
        const secret = process.env.SECRET_KEY;
        const decode = jwt.verify(token , secret);
        console.log(decode);
    //check for user role as per token
         userRole = decode.role;
    } catch (error) {
        logger.error(errorMessages.TOKEN_EXPIRED)
        return res.status(401).json(errorMessages.TOKEN_EXPIRED)
    }
    logger.info(`User Role - ${userRole}`)
    //check for authorization
    if(userRole == "Super_Admin" || userRole == "super_admin"){
        //check for email and password provided or not
        if(!email || !password){
            logger.error(errorMessages.EMAIL_AND_NEWPASS_REQUIRED)
            return res.status(400).json(errorMessages.EMAIL_AND_NEWPASS_REQUIRED)
        }else{
            
            //check the email and update the password in DB
            const userData = await AdminUser.findOneAndUpdate({email},{password},{new:true})
            //console.log(userData);
            //check for record found or not in DB
            userData.save();
            if(userData == null){
                logger.error(errorMessages.NOT_FOUND)
                return res.status(404).json(errorMessages.NOT_FOUND)
            }else{
                logger.info(successMessages.PASSWORD_RESET_SUCCESSFULLY)
                logger.info(`End`);
                //response
                return res.status(200).json(successMessages.PASSWORD_RESET_SUCCESSFULLY)
            }
        }

    }else{
        logger.error(errorMessages.ACCESS_DENIED)
        return res.status(403).json(errorMessages.ACCESS_DENIED)
    }
} catch (error) {
    logger.error(errorMessages.RESET_PASSWORD_FAILED)
    return res.status(500).json(errorMessages.INTERNAL_ERROR)
}
}