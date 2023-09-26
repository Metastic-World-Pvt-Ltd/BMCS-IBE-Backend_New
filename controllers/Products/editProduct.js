const Product = require('../../models/Product');
const AdminUser = require('../../models/AdminUser');
const jwt = require('jsonwebtoken');
const logger = require('../User/logger');
const errorMessages = require('../../response/errorMessages');
const successMessages = require('../../response/successMessages');
require('dotenv').config({path:'../../.env'});

module.exports.editProduct = async function(req, res){
try {
    logger.info(`Start`);
    logger.info(successMessages.EDIT_PRODUCT_ACTIVATED)
    //user input
    const {productName, productSummary, requiredDoc} = req.body;
    //token input
    logger.info(`${productName}, ${productSummary}, ${requiredDoc}`)
    const token = req.body.token || req.query.token || req.headers["x-access-token"];
    const _id = req.params.id || req.body.id || req.query.id || req.headers["id"];
    console.log("Id", _id);
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

        const isExist = await Product.findById({_id});
        if(isExist){
            // console.log(isExist);
            try {
                const updatedBy = adminEmail;
                //update records into db
                const updatedData = await Product.findByIdAndUpdate(_id, 
                    {productName, productSummary, requiredDoc , updatedBy}
                     , {new:true} )
                logger.info(`Updated Data - ${updatedData}`) 
                logger.info(`End`);  
                //response  
                return res.status(200).json(updatedData);
            } catch (error) {
                logger.error(`Error - ${error}`)
                return res.json(error)
            }
            
        }else{
            logger.error(errorMessages.NOT_FOUND)
            return res.status(404).json(errorMessages.NOT_FOUND)
        }
        
    }
} catch (error) {
    logger.error(errorMessages.EDIT_PRODUCT_FAILED)
    return res.status(500).json(errorMessages.INTERNAL_ERROR)
}    
}