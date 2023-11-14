const Kyc = require('../../models/Kyc');
const errorMessages = require('../../response/errorMessages');
const successMessages = require('../../response/successMessages');
var CryptoJS = require("crypto-js");
const jwt = require('jsonwebtoken');
const logger = require('../User/logger');
const AdminUser = require('../../models/AdminUser');
require('dotenv').config({path:'../../.env'});


module.exports.verifyKyc = async function(req, res){
    try {
        var {empId ,status , comment} = req.body;
            //user input
            var token = req.body.token || req.query.token || req.headers["x-access-token"];
            //check for valid response
            if(!token){
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
                 var id =decode.id
                 var closedBy = decode.email;
            } catch (error) {
                return res.status(401).json(errorMessages.TOKEN_EXPIRED)
            }
                //check Admin user is active or not
            try {
                var activeUser = await AdminUser.findById(id) 
                 if(activeUser == null){
                    logger.error(`In active Admin`)
                    return res.status(401).json(errorMessages.ACCESS_DENIED)
                }
            } catch (error) {
                logger.error(errorMessages.SOMETHING_WENT_WRONG)
                return res.status(502).json(errorMessages.SOMETHING_WENT_WRONG)
            }
    
    
        if(!empId){
            return res.status(400).json(errorMessages.ALL_FIELDS_REQUIRED)
        }
        try {
           
            const isExist = await Kyc.findOne({empId});
            console.log("isExist",isExist.status);
            if(isExist.status == 'In Progress'){
                if(status == 'Rejected' && !comment){
                    return res.status(400).json(errorMessages.COMMENT_REQUIRED)
                }
                if(!comment){
                    comment = '';
                }
                const updateStatus = await Kyc.findOneAndUpdate({empId},{status ,comment, closedBy},{new:true});
                console.log(updateStatus);
                if(!updateStatus){
                    return res.status(404).json(errorMessages.NOT_FOUND)
                }else{
                    res.status(200).json(successMessages.STATUS_HAS_UPDATED_SUCCESSFULLY)
                }
            }else{
                return res.status(404).json(errorMessages.ACCESS_DENIED)
            }


        } catch (error) {
            return res.status(502).json(errorMessages.BAD_GATEWAY);
        }
    } catch (error) {
        return res.status(500).json(errorMessages.INTERNAL_ERROR)
    }
   
}