const User = require('../../models/User');
const errorMessages = require('../../response/errorMessages');
const AdminUser = require('../../models/AdminUser');
const successMessages = require('../../response/successMessages');
const logger = require('../User/logger');
const jwt = require('jsonwebtoken');
require('dotenv').config({path:'../../.env'});
var CryptoJS = require("crypto-js");
module.exports.changeUserStatus = async function(req ,res){
try {
    const  {userStatus} = req.body;
   
    if(!userStatus){
        return res.status(400).json(errorMessages.ALL_FIELDS_REQUIRED)
    }
    
    var token = req.body.token || req.query.token || req.headers["x-access-token"];

    const empId = req.params.id || req.body.id || req.query.id || req.headers["id"];
    if(!empId){
        logger.info(errorMessages.ALL_FIELDS_REQUIRED)
        return res.status(400).json(errorMessages.ALL_FIELDS_REQUIRED)
    }
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
    const adminEmail = decode.email;
    const activeUser = await AdminUser.findOne({_id})
    
    if(activeUser == null){
        logger.error(`In active Admin`)
        return res.status(401).json(errorMessages.ACCESS_DENIED)
    }
    logger.info(`User Role - ${userRole}`)
    //check for authorization
    if(userRole == "Admin" || userRole == "admin" || userRole == "Super_Admin" || userRole == "super_admin"){
        try {
            const data =  await User.findOne({empId});
            if(data){
               try {
                    const updateIBE = await User.findOneAndUpdate({empId},{userStatus},{new:true});
                    if(updateIBE){
                        return res.status(200).json(successMessages.RECORD_UPDATED_SUCCESSFULLY);
                    }else{
                        return res.status(404).json(errorMessages.NOT_FOUND)
                    }
               } catch (error) {
                    logger.error(error)
                    return res.status(502).json(errorMessages.BAD_GATEWAY)
               }
            }else{
                return res.status(404).json(errorMessages.NOT_FOUND)
            }
        } catch (error) {
            logger.error(error)
            return res.status(502).json(errorMessages.BAD_GATEWAY)
        }
    }else{
        return res.status(401).json(errorMessages.ACCESS_DENIED)
    }
} catch (error) {
    return res.status(500).json(errorMessages.INTERNAL_ERROR)
}
}