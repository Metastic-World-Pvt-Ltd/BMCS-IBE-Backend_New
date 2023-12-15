const jwt = require('jsonwebtoken');
const logger = require('../controllers/User/logger');
require('dotenv').config({path:'../.env'});
const errorMessages = require('../response/errorMessages');
var CryptoJS = require("crypto-js");
const AdminUser = require('../models/AdminUser');

module.exports.verifyAdminUser = async function(req, res, next){

// try {
    var token = req.body.token || req.query.token || req.headers["x-access-token"];
    if (!token) {
        logger.error(errorMessages.TOKEN_NOT_FOUND)
        return res.status(400).send(errorMessages.TOKEN_NOT_FOUND);
      }

    try {
        var secret = process.env.SECRET_KEY;
        // Decrypt
        var bytes  = CryptoJS.AES.decrypt(token, secret);
        token = bytes.toString(CryptoJS.enc.Utf8);
    } catch (error) {
        return res.json(errorMessages.TOKEN_INVALID)
    }
    try {

        const data = jwt.verify(token , secret)
        console.log(data.email);
        var id = data.id;
        var activeUser = await AdminUser.findById(id);
        if(activeUser == null){
            logger.error(`In active Admin`)
            return res.status(401).json(errorMessages.ACCESS_DENIED)
        }
        req.user = data;
        module.exports.data = data;
               
    } catch (error) {
        if(error.message == "jwt expired"){
            logger.error(errorMessages.TOKEN_EXPIRED)
            return res.status(401).json(errorMessages.TOKEN_EXPIRED)
        }else if(error.message == "invalid token"){
            logger.error(errorMessages.TOKEN_INVALID)
            return res.status(401).json(errorMessages.TOKEN_INVALID)
        }else{
            logger.error(`Error -${error}`)
            return res.status(401).json(error)
        }
        
    }
    return next();
// } catch (error) {
//     logger.error(`Verify user middleware Failed`)
//     return res.status(500).json('Something went wrong in user verification')
// }

    
}
