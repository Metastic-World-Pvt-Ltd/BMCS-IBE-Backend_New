const Product = require('../../models/Product');
const AdminUser = require('../../models/AdminUser');
const jwt = require('jsonwebtoken');
const logger = require('../User/logger');
const DeletedProject = require('../../models/DeletedProject');
const errorMessages = require('../../response/errorMessages');
const successMessages = require('../../response/successMessages');
var CryptoJS = require("crypto-js");
require('dotenv').config({path:'../../.env'});

module.exports.deleteProduct = async function(req , res){
try {
    logger.info(successMessages.DELETE_PRODUCT_ACTIVATED)
    //token input
    var token = req.body.token || req.query.token || req.headers["x-access-token"];
    //product id to delete the product
    const productId = req.params.id || req.body.id || req.query.id || req.headers["id"];
    // console.log("Id", _id);
    //check for valid response
    if(!token){
        logger.error(errorMessages.TOKEN_NOT_FOUND)
        return res.status(401).json(errorMessages.TOKEN_NOT_FOUND);
    }
   
    var userRole;
    try {
         //decode token signature
         const secret = process.env.SECRET_KEY;
         // Decrypt
         var bytes  = CryptoJS.AES.decrypt(token, secret);
         token = bytes.toString(CryptoJS.enc.Utf8);
        const decode = jwt.verify(token , secret);
    //check for user role as per token
         userRole = decode.role;
    } catch (error) {
        return res.status(401).json(errorMessages.TOKEN_EXPIRED)
    }
    const userId = decode.id;
    const adminEmail = decode.email;
    //user role decoded from token
     userRole = decode.role;
        //check Admin user is active or not
        const activeUser = await AdminUser.findById({_id:userId}) 
        if(activeUser == null){
            logger.error(`In active Admin`)
            return res.status(401).json(errorMessages.ACCESS_DENIED)
        }
    logger.info(`User Role - ${userRole}`)
    //condition to check role specific rights
    if(userRole == "Super_Admin" || userRole == "super_admin" || userRole == "Admin" || userRole == "admin"){
        //chek product exist in DB or not
        const isExist = await Product.findOne({productId});
        logger.info(`Data found in DB - ${isExist}`)
        if(isExist){
            //insert deleteby filed into prev data
            isExist.deletedBy = adminEmail;
            //insert data to be deleted into DB
            const creatDeletedData = await DeletedProject.insertMany(isExist);
            logger.info(`Created Deleted Record in to Db - Data -${creatDeletedData}`)
            //delete the product from DB
            const deletedData = await Product.findOneAndDelete({productId});
            try {
                //response
                logger.info(`${successMessages.RECORD_DELETED_SUCCESSFULLY} - Data - ${deletedData}`)
                logger.info(`End`);
                return res.status(200).json(successMessages.RECORD_DELETED_SUCCESSFULLY)
            } catch (error) {
                logger.error(`Error - ${error}`)
                return res.json(`Error - ${error}`)
            }
                          
        }else{
            logger.error(errorMessages.NOT_FOUND)
            return res.status(404).json(errorMessages.NOT_FOUND)
        }
    }
} catch (error) {
    logger.error(errorMessages.DELETE_PRODUCT_FAILED);
    return res.status(500).json(errorMessages.INTERNAL_ERROR)
}
}