const Product = require('../../models/Product');
const AdminUser = require('../../models/AdminUser');
const jwt = require('jsonwebtoken');
const logger = require('../User/logger');
const DeletedProject = require('../../models/DeletedProject');
require('dotenv').config({path:'../../.env'});

module.exports.deleteProject = async function(req , res){
try {
    logger.info(`Activated Delete Product Endoint`)
    //token input
    const token = req.body.token || req.query.token || req.headers["x-access-token"];
    //product id to delete the product
    const _id = req.params.id || req.body.id || req.query.id || req.headers["id"];
    // console.log("Id", _id);
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
        //chek product exist in DB or not
        const isExist = await Product.findById({_id});
        logger.info(`Data found in DB - ${isExist}`)
        if(isExist){
            //insert deleteby filed into prev data
            isExist.deletedBy = adminEmail;
            //insert data to be deleted into DB
            const creatDeletedData = await DeletedProject.insertMany(isExist);
            logger.info(`Created Deleted Record in to Db - Data -${creatDeletedData}`)
            //delete the product from DB
            const deletedData = await Product.findByIdAndDelete({_id});
            try {
                //response
                logger.info(`Record Deleted Successfully - Data - ${deletedData}`)
                return res.status(200).json(`Record Deleted Successfully!`)
            } catch (error) {
                logger.error(`Error - ${error}`)
                return res.json(`Error - ${error}`)
            }
                          
        }else{
            logger.error(`No Record Found`)
            return res.status(404).json(`No Record Found`)
        }
    }
} catch (error) {
    logger.error(`Delete Project Endpoint Failed`);
    return res.status(500).json(`Something went wrong in deleting product`)
}
}