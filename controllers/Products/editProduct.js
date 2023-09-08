const Product = require('../../models/Product');
const AdminUser = require('../../models/AdminUser');
const jwt = require('jsonwebtoken');
const logger = require('../User/logger');
require('dotenv').config({path:'../../.env'});

module.exports.editProduct = async function(req, res){
try {
    logger.info(`Activated Edit Product Endoint`)
    //user input
    const {productName, productSummary, requiredDoc} = req.body;
    //token input
    logger.info(`${productName}, ${productSummary}, ${requiredDoc}`)
    const token = req.body.token || req.query.token || req.headers["x-access-token"];
    const _id = req.params.id || req.body.id || req.query.id || req.headers["id"];
    console.log("Id", _id);
    //check for valid response

    if(!token){
        logger.error(`Token not Found`)
        return res.status(401).json('Please Provide Token');
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
        return res.status(401).json(`Token Expired`)
    }
    const userId = decode.id;
    const adminEmail = decode.email;
    //user role decoded from token
     userRole = decode.role;
        //check Admin user is active or not
        const activeUser = await AdminUser.findById({_id:userId}) 
        if(activeUser == null){
            logger.error(`In active Admin`)
            return res.status(401).json(`Access Denied`)
        }
    logger.info(`User Role - ${userRole}`)
    //condition to check role specific rights
    if(userRole == "Super_Admin" || userRole == "super_admin" || userRole == "Admin" || userRole == "admin"){

        const isExist = await Product.findById({_id});
        if(isExist){
            // console.log(isExist);
            try {
                const updatedBy = adminEmail;
                
                const updatedData = await Product.findByIdAndUpdate(_id, 
                    {productName, productSummary, requiredDoc , updatedBy}
                     , {new:true} )
                logger.info(`Updated Data - ${updatedData}`)     
                return res.status(200).json(updatedData);
            } catch (error) {
                logger.error(`Error - ${error}`)
                return res.json(error)
            }
            
        }else{
            logger.error(`Record Not Found`)
            return res.status(404).json(`Record Not Found`)
        }
        
    }
} catch (error) {
    logger.error(`Edit Product Endpoint Failed`)
    return res.status(500).json(`Something went wrong in editing product`)
}    
}