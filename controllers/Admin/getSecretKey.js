const errorMessages = require('../../response/errorMessages');
const APIKEY = require("../../models/APIKEY");
const logger = require('../User/logger');
const successMessages = require('../../response/successMessages');
require('dotenv').config({path:'../../.env'});


module.exports.getSecretKey = async function(req, res){

    try {
        logger.info(successMessages.GET_SECERET_KEY_ACTIVATED)
        logger.info(successMessages.START);
        const username = req.body.username || req.query.username || req.headers["username"];
        console.log("username",username);
        logger.info(`Input - ${username}`);
        if(!username){
            return res.status(400).json(errorMessages.ALL_FIELDS_REQUIRED);
        }
        const apiData = await APIKEY.findOne({username});
        logger.info(`Record in DB - ${apiData}`)
        
        if(apiData){
            logger.info(`Response - ${apiData.secretKey}`)
            logger.info(successMessages.END);
            return res.status(200).json({Key:apiData.secretKey})
        }else{
            logger.error(`Error - ${errorMessages.NOT_FOUND}`)
            return res.status(404).json(errorMessages.NOT_FOUND);
        }
    } catch (error) {
        logger.error(errorMessages.GET_SECRET_KEY_FAILED)
        return res.status(500).json(errorMessages.INTERNAL_ERROR);
    }

}
