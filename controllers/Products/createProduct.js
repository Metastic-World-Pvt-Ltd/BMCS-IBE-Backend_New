const Product = require('../../models/Product');
const AdminUser = require('../../models/AdminUser');
const jwt = require('jsonwebtoken');
const logger = require('../User/logger');
const errorMessages = require('../../response/errorMessages');
const successMessages = require('../../response/successMessages');
require('dotenv').config({path:'../../.env'});
var CryptoJS = require("crypto-js");
const fs =  require('fs')
module.exports.createProduct = async function(req , res){
try {
    logger.info(`Start`);
    logger.info(successMessages.CREATE_PRODUCT_ACTIVATED)
    //user input
    const {productName, productSummary, requiredDoc ,marketPrice , offerPrice ,discount  ,category , subCategory} = req.body;
    
    //token input
    logger.info(`${productName}, ${productSummary}, ${requiredDoc}`)
    var token = req.body.token || req.query.token || req.headers["x-access-token"];
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
        // Decrypt
        var bytes  = CryptoJS.AES.decrypt(token, secret);
        token = bytes.toString(CryptoJS.enc.Utf8);
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

            //upload files
            try {
                if(req.files){
                  //store file path
                  console.log();
                     const mim = JSON.parse(req.body.imageURL);
                     console.log("MInData",mim);
                    //split file extention name   
                    const parts = mim.mimetype.split('/')
                    const ext = parts[1];
                    //define allowed file types
                    const allowedTypes = ['image/jpeg', 'image/jpg','image/png'];
                        if (allowedTypes.includes(mim.mimetype)) {
                            //check file size
                            if(mim.size < 1000000){
                            //file name
                                const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
                                const filename = `${mim.fieldname}-${uniqueSuffix}.${mim.originalname.split('.').pop()}`;
                                //file path
                                var filePath = 'D:/Product/'+ filename;
                                //write file in dir
                                var mybuffer = new Buffer(mim.buffer.length)
                              for(var i=0;i<mim.buffer.length;i++){
                                mybuffer[i]=mim.buffer[i];
                              }
                              fs.writeFile(filePath,mybuffer,function(err){
                                if(err){
                                    console.log(err);

                                }
                                else{
                                    console.log("saved");
                                }
                              });
                                //file path
                                console.log("filePath",filePath);
                                var imageURL = filePath;
    
                            }else{
                                logger.error(errorMessages.MAX_ALLOWED_SIZE)
                                return res.status(400).json(errorMessages.MAX_ALLOWED_SIZE);
                            
                            }
    
                        } else {
                        logger.error(errorMessages.INVALID_FILE) 
                        return res.status(400).json(errorMessages.INVALID_FILE);
                        }
                
                //     }
                
                }else{
                    return res.status(400).json(errorMessages.ALL_FIELDS_REQUIRED)
                }
            } catch (error) {
                return res.json(errorMessages.SOMETHING_WENT_WRONG)
            }

            //create product and Store into DB
            const productData = await Product.create({
                productId, productName, productSummary, requiredDoc, costomerCount:0 , createdBy , marketPrice , offerPrice ,discount , imageURL ,category , subCategory
            })
            logger.info(`Product Created - ${productData}`)
            logger.info(`End`);
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