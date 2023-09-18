const Product = require('../../models/Product');
const AdminUser = require('../../models/AdminUser');
const jwt = require('jsonwebtoken');
const logger = require('../User/logger');
const errorMessages = require('../errorMessages');
const successMessages = require('../successMessages');
require('dotenv').config({path:'../../.env'});

module.exports.createProduct = async function(req , res){
try {
    logger.info(successMessages.CREATE_PRODUCT_ACTIVATED)
    //user input
    const {productName, productSummary, requiredDoc} = req.body;
    //token input
    logger.info(`${productName}, ${productSummary}, ${requiredDoc}`)
    const token = req.body.token || req.query.token || req.headers["x-access-token"];
    //check for valid response
    if(!token){
        logger.error(errorMessages.TOKEN_NOT_FOUND)
        return res.status(401).json(errorMessages.TOKEN_NOT_FOUND);
    }
    var decode;
    var userRole;
    try {
        //decode token signature
        const secret = process.env.SECRET_KEY;
         decode = jwt.verify(token , secret);
    //check for user role as per token
         userRole = decode.role;
    } catch (error) {
        return res.status(401).json(errorMessages.TOKEN_EXPIRED)
    }
    const _id = decode.id;
    const adminEmail = decode.email;
    //user role decoded from token
     userRole = decode.role;
        //check Admin user is active or not
        const activeUser = await AdminUser.findById({_id}) 
        if(activeUser == null){
            logger.error(`In active Admin`)
            return res.status(401).json(errorMessages.ACCESS_DENIED)
        }
    logger.info(`User Role - ${userRole}`)
    //condition to check role specific rights
    if(userRole == "Super_Admin" || userRole == "super_admin" || userRole == "Admin" || userRole == "admin"){

        const isExist = await Product.findOne({productName});
        //check product exist or not
        if(!isExist){
            //split product name first 3 char
            const typeChar = productName.substr(0, 3);
            //convert into UPPER case
            const upperCase = typeChar.toUpperCase();
            //create productId 
            const productId = upperCase + Date.now();
            //get admin id from decoded token
            const createdBy = adminEmail;
            //create product and Store into DB
            const productData = await Product.create({
                productId, productName, productSummary, requiredDoc, costomerCount:0 , createdBy ,
            })
            logger.info(`Product Created - ${productData}`)
            //response
            return res.status(200).json(productData)
        }else{
            logger.error(errorMessages.PRODUCT_ALREADY_EXIST)
            return res.status(422).json(errorMessages.PRODUCT_ALREADY_EXIST)
        }
    }else{
        logger.error(errorMessages.ACCESS_DENIED)
        return res.status(403).json(errorMessages.ACCESS_DENIED)
    }
} catch (error) {
    logger.error(errorMessages.CREATE_PRODUCT_FAILED)
    return res.status(500).json(errorMessages.INTERNAL_ERROR)
}
}