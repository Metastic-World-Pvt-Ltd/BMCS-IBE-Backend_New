const errorMessages = require('../../response/errorMessages');
const APIKEY = require("../../models/APIKEY");
const logger = require('../User/logger');
require('dotenv').config({path:'../../.env'});


module.exports.getSecretKey = async function(req, res){
    // const {username} = req.body;

    const username = req.body.username || req.query.username || req.headers["username"];
    console.log("username",username);
    if(!username){
        return res.status(400).json(errorMessages.ALL_FIELDS_REQUIRED);
    }
    const apiData = await APIKEY.findOne({username});
    console.log("apiData",apiData);
    if(apiData){
        return res.status(200).json({Key:apiData.secretKey})
    }else{
        return res.status(404).json(errorMessages.NOT_FOUND);
    }
}
