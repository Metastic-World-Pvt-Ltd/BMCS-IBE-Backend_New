const AdminUser = require('../../models/AdminUser');
var CryptoJS = require("crypto-js");
const jwt = require('jsonwebtoken');
const logger = require('../User/logger');
const errorMessages = require('../../response/errorMessages');
const successMessages = require('../../response/successMessages');
require('dotenv').config({path:'../../.env'});
module.exports.getAllAdminUser = async function(req, res){
try {
    
    logger.info(successMessages.START)
    logger.info(successMessages.GET_ALL_ADMIN_USER)

    var token = req.body.token || req.query.token || req.headers["x-access-token"];

    //check for token provided or not
    if(!token){
        logger.error(errorMessages.TOKEN_NOT_FOUND)
        return res.status(401).json(errorMessages.TOKEN_NOT_FOUND);
    }

    var userRole;
    var decode;
    try {
        //decode token signature
        const secret = process.env.SECRET_KEY;
         // Decrypt
         var bytes  = CryptoJS.AES.decrypt(token, secret);
         token = bytes.toString(CryptoJS.enc.Utf8);
         decode = jwt.verify(token , secret);
    //check for user role as per token
         userRole = decode.role;

    } catch (error) {
        logger.error(errorMessages.TOKEN_EXPIRED);
        return res.status(401).json(errorMessages.TOKEN_EXPIRED)
    }
    const _id = decode.id;
    var email = decode.email;
    const activeUser = await AdminUser.findById({_id})
    
    if(activeUser == null){
        logger.error(`In active Admin`)
        return res.status(401).json(errorMessages.ACCESS_DENIED)
    }
    logger.info(`User Role - ${userRole}`)
    //check for authorization
    if(userRole == "Super_Admin" || userRole == "super_admin"){
        const isExist = await AdminUser.findOne({email});
        console.log("isExist",isExist);
        logger.info(`User In DB - ${isExist}`)
        if(isExist == null){
            logger.error(errorMessages.NOT_FOUND)
            return res.status(404).json(errorMessages.NOT_FOUND)
        }
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = 8;
            const count = await AdminUser.countDocuments();

            const userData = await AdminUser.find({},{password:0})
            .skip((page - 1) * limit)
            .limit(limit);
            console.log(userData);
            if(userData.length != 0){
                logger.info(successMessages.END)
                return res.status(200).json({
                    page,
                    totalPages: Math.ceil(count / limit),
                    'Admin_Users':userData
                })
            }
            else{
                logger.error(errorMessages.NOT_FOUND)
                return res.status(404).json(errorMessages.NOT_FOUND)
            }
            
        } catch (error) {
            logger.error(error)
            return res.status(502).json(errorMessages.BAD_GATEWAY)
        }

    }else{
        logger.error(errorMessages.ACCESS_DENIED)
        return res.status(403).json(errorMessages.ACCESS_DENIED)
    }
} catch (error) {
    logger.error(errorMessages.GET_ALL_ADMIN_USER_FAILED);
    return res.status(500).json(errorMessages.INTERNAL_ERROR);
}

}