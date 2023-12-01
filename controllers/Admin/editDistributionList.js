const DistributionList = require('../../models/DistributionList');
const errorMessages = require('../../response/errorMessages');
const successMessages = require('../../response/successMessages');
var CryptoJS = require("crypto-js");
const jwt = require('jsonwebtoken');
const logger = require('../User/logger');
const AdminUser = require('../../models/AdminUser');
require('dotenv').config({path:'../../.env'});

module.exports.editDistributionList = async function(req , res){
    const dl_Id = 'b382fc1e7290490c819b27cd07c45a9d';

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
                 var updatedBy = decode.email;
            } catch (error) {
                return res.status(401).json(errorMessages.TOKEN_EXPIRED)
            }
                //check Admin user is active or not
            try {
                var activeUser = await AdminUser.findById(id) 
                console.log("admin",activeUser);
                 if(activeUser == null){
                    logger.error(`In active Admin`)
                    return res.status(401).json(errorMessages.ACCESS_DENIED)
                }
                
                const data = await DistributionList.findOneAndUpdate({dl_Id},req.body,{new:true});

                if(data){
                    return res.status(200).json(data)
                }else{
                    return res.status(404).json(errorMessages.NOT_FOUND);
                }

            } catch (error) {
                logger.error(errorMessages.SOMETHING_WENT_WRONG)
                return res.status(502).json(errorMessages.SOMETHING_WENT_WRONG)
            }
}