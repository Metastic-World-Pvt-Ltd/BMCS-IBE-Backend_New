var CryptoJS = require("crypto-js");
const errorMessages = require('../../response/errorMessages');
const APIKEY = require("../../models/APIKEY");
require('dotenv').config({path:'../../.env'});
const logger = require('../User/logger');
const successMessages = require("../../response/successMessages");
module.exports.generateSecretAPIKey =  async function(req, res){
try {
    logger.info(successMessages.GENERATE_SECRET_API_KEY_ACTIVATED)
    const Key = process.env.API_SECRET_KEY;
    
    const {username} = req.body
    logger.info(successMessages.START)
    if(!username){
        logger.error(`Error - ${errorMessages.ALL_FIELDS_REQUIRED}`)
        return res.status(400).json(errorMessages.ALL_FIELDS_REQUIRED)
    }
    try {
        var x_secret_key = CryptoJS.AES.encrypt(username, Key).toString();
        logger.info(`Secret Key Generated Successfully`)
    } catch (error) {
        logger.error(`Error - ${errorMessages.SOMETHING_WENT_WRONG}`)
        return res.json(errorMessages.SOMETHING_WENT_WRONG)
    }
    
    const isExist = await APIKEY.findOne({username})
    logger.info(`User in DB - ${isExist}`)
    if(isExist){
        logger.error(`Error - ${errorMessages.RECORD_ALREADY_EXIST}`)
        return res.status(422).json(errorMessages.RECORD_ALREADY_EXIST);
    }
    try {
        const secretData = new APIKEY({
            username , secretKey:x_secret_key,
        })
        await secretData.save();
        logger.info(successMessages.RECORD_ADDED_SUCCESSFULLY)
        return res.status(200).json(successMessages.RECORD_ADDED_SUCCESSFULLY)
    } catch (error) {
        logger.error(`Error - ${errorMessages.SOMETHING_WENT_WRONG}`)
        return res.json(errorMessages.SOMETHING_WENT_WRONG)
    }

} catch (error) {
    logger.error(`Error - ${errorMessages.GENERATE_SECRET_API_KEY_FAILED}`)
    return res.status(500).json(errorMessages.INTERNAL_ERROR)
}


}