const DistributionList = require('../../models/DistributionList');
const errorMessages = require('../../response/errorMessages');
var CryptoJS = require("crypto-js");
const AdminUser = require('../../models/AdminUser');
const logger = require('../User/logger');
require('dotenv').config({path:'../../.env'});
const jwt = require('jsonwebtoken');
const uuid = require('uuid');

const successMessages = require('../../response/successMessages');

module.exports.createDistributionList = async function(req , res){
// try {
    logger.info(successMessages.START)
    logger.info(successMessages.CREATE_DISTRIBUTION_LIST_ACTIVATED)
    const {level_1 , level_2 , level_3 , level_4 , level_5 , 
        level_6 , level_7 , level_8 , level_9 , level_10 , 
        level_11 , level_12 , level_13 , level_14 , level_15 } = req.body;

    if(!level_1 || !level_2 || !level_3 || !level_4 || !level_5 || !level_6 || !level_7 || !level_8 || !level_9 || !level_10 || !level_11 || !level_12 || !level_13 || !level_14 || !level_15){
        return res.status(400).json(errorMessages.ALL_FIELDS_REQUIRED);
    }    

    var token = req.body.token || req.query.token || req.headers["x-access-token"];

    //check for token provided or not
    if(!token){
        logger.error(errorMessages.TOKEN_NOT_FOUND , successMessages.END)
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
         var _id = decode.id;
         var adminEmail = decode.email;

    } catch (error) {
        logger.error(errorMessages.TOKEN_EXPIRED , successMessages.END);
        return res.status(401).json(errorMessages.TOKEN_EXPIRED)
    }

    const activeUser = await AdminUser.findById({_id})
    
    if(activeUser == null){
        logger.error(`In active Admin`, successMessages.END)
        return res.status(401).json(errorMessages.ACCESS_DENIED)
    }
    logger.info(`User Role - ${userRole}`)
    //check for authorization
    if(userRole == "Super_Admin" || userRole == "super_admin"){

        try {
            const generateID = () => {
                const id = uuid.v4().replace(/-/g, ''); // Remove dashes from the generated UUID
                return id;
              };

            const dl_Id = generateID();

            const data = await DistributionList.create({
                dl_Id , level_1 , level_2 , level_3 , level_4 , level_5 , 
            level_6 , level_7 , level_8 , level_9 , level_10 , 
            level_11 , level_12 , level_13 , level_14 , level_15
            });
    
            logger.info(successMessages.RECORD_ADDED_SUCCESSFULLY, successMessages.END)
            return res.status(200).json(successMessages.RECORD_ADDED_SUCCESSFULLY);
        } catch (error) {
            logger.error(error)
            return res.status(502).json(errorMessages.BAD_GATEWAY)
        }


    }else{
        logger.error(errorMessages.ACCESS_DENIED)
        return res.status(403).json(errorMessages.ACCESS_DENIED)
    }
// } catch (error) {
//     logger.error(error , errorMessages.CREATE_DISTRIBUTION_LIST_FAILED);
//     return res.status(500).json(errorMessages.INTERNAL_ERROR)
// }
}
