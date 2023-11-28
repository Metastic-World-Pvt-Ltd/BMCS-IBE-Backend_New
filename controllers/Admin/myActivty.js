const Project =  require('../../models/Project');
const errorMessages = require('../../response/errorMessages');
const successMessages = require('../../response/successMessages');
var CryptoJS = require("crypto-js");
const jwt = require('jsonwebtoken');
const logger = require('../User/logger');
const AdminUser = require('../../models/AdminUser');
const Kyc = require('../../models/Kyc');

module.exports.myActivity = async function(req , res){
    var Activity = [];
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
                 var userEmail = decode.email;
            } catch (error) {
                return res.status(401).json(errorMessages.TOKEN_EXPIRED)
            }
                //check Admin user is active or not
            try {
                var activeUser = await AdminUser.findById({_id:id}) 
                console.log("activeUser",activeUser);
                 if(activeUser == null){
                    logger.error(`In active Admin`)
                    return res.status(401).json(errorMessages.ACCESS_DENIED)
                }
            } catch (error) {
                logger.error(errorMessages.SOMETHING_WENT_WRONG)
                return res.status(502).json(errorMessages.SOMETHING_WENT_WRONG)
            }

            //get all project details
            try {
                //get admin project accepted by
                const acceptedByData = await Project.find({acceptedBy: userEmail})
                Activity.push({key:'AcceptedProject',value:acceptedByData})
                //get admin project closed by       
                const closedByData = await Project.find({closedBy: userEmail})
                Activity.push({key:'ClosedProject',value:closedByData})
            } catch (error) {
                return res.status(502).json(errorMessages.BAD_GATEWAY);
            }
            //end of get all project details

            //get all KYC details
            try {
                //get admin project accepted by
                const acceptedByKyc = await Kyc.find({acceptedBy: userEmail})
                Activity.push({key:'AcceptedKyc',value:acceptedByKyc})
                //get admin project closed by       
                const closedByKyc = await Kyc.find({closedBy: userEmail})
                Activity.push({key:'ClosedKyc',value:closedByKyc})

                //get admin project closed by       
                const rejectedByKyc = await Kyc.find({rejectedBy: userEmail})
                Activity.push({key:'RejectedKyc',value:rejectedByKyc})
            } catch (error) {
                return res.status(502).json(errorMessages.BAD_GATEWAY);
            }
            //end of get all KYC details


            // console.log(data);
            res.json(Activity)
            
}