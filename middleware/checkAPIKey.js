var CryptoJS = require("crypto-js");
const APIKEY = require('../models/APIKEY');
const errorMessages = require("../response/errorMessages");
require('dotenv').config({path:'../.env'});
module.exports.checkAPIKey =  async function(req , res , next){
    const x_secret_key = req.body.key || req.query.key || req.headers["x_secret_key"];
        if(!x_secret_key){
            return res.status(401).json(errorMessages.SECRETE_KEY_REQUIRED)
        }
        console.log("x_secret_key",x_secret_key);
        const Key = process.env.API_SECRET_KEY;
        // Decrypt
        var bytes  = CryptoJS.AES.decrypt(x_secret_key, Key);
        var username = bytes.toString(CryptoJS.enc.Utf8);
        console.log('Decrypted Text:', username);

        const isMatch =  await APIKEY.findOne({username})
        console.log(isMatch);
        if(!isMatch){
            return res.status(401).json(errorMessages.ACCESS_DENIED)
        }
    
    return next();
}