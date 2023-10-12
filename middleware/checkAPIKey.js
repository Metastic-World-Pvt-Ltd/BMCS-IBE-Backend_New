var CryptoJS = require("crypto-js");
const APIKEY = require('../models/APIKEY');
const errorMessages = require("../response/errorMessages");
const logger = require("../controllers/User/logger");
const successMessages = require("../response/successMessages");
require('dotenv').config({path:'../.env'});
module.exports.checkAPIKey =  async function(req , res , next){
try {
    logger.info(successMessages.CHECK_API_MIDDLEWARE_ACTIVATED)
    const x_secret_key = req.body.key || req.query.key || req.headers["x_secret_key"];
    logger.info(`Key - ${x_secret_key}`)
        if(!x_secret_key){
            logger.error(errorMessages.ECRETE_KEY_REQUIRED)
            return res.status(401).json(errorMessages.SECRETE_KEY_REQUIRED)
        }
        const Key = process.env.API_SECRET_KEY;
        // Decrypt
        var bytes  = CryptoJS.AES.decrypt(x_secret_key, Key);
        var username = bytes.toString(CryptoJS.enc.Utf8);
        logger.info(`Username  - ${username}`)

        const isMatch =  await APIKEY.findOne({username})
        logger.info(`Record in DB - ${isMatch}`)
        if(!isMatch){
            logger.error(`Error - ${errorMessages.ACCESS_DENIED}`)
            return res.status(401).json(errorMessages.ACCESS_DENIED)
        }
    
    return next();
} catch (error) {
    logger.error(errorMessages.CHECK_API_MIDDLEWARE_FAILED)
    return res.status(500).json(errorMessages.INTERNAL_ERROR)
}
}