var CryptoJS = require("crypto-js");
const errorMessages = require('../../response/errorMessages');
const APIKEY = require("../../models/APIKEY");
require('dotenv').config({path:'../../.env'});
module.exports.generateSecretAPIKey =  async function(req, res){
// try {
    const Key = process.env.API_SECRET_KEY;
    
    const {username} = req.body
    if(!username){
        return res.status(400).json(errorMessages.ALL_FIELDS_REQUIRED)
    }
    // try {
        var x_secret_key = CryptoJS.AES.encrypt(username, Key).toString();
    // } catch (error) {
    //     return res.json(errorMessages.SOMETHING_WENT_WRONG)
    // }
    console.log("x_secret_key",x_secret_key);
    const isExist = await APIKEY.findOne({username})
    if(isExist){
        return res.status(422).json(errorMessages.RECORD_ALREADY_EXIST);
    }
    // try {
        const secretData = new APIKEY({
            username , secretKey:x_secret_key,
        })
        await secretData.save();
    // } catch (error) {
    //     return res.json(errorMessages.SOMETHING_WENT_WRONG)
    // }

    return res.json(secretData);
// } catch (error) {
//     return res.status(500).json(errorMessages.INTERNAL_ERROR)
// }


}