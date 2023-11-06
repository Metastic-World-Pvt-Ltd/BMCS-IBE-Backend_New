const Kyc = require('../../models/Kyc');
const errorMessages = require('../../response/errorMessages');

module.exports.getInpKyc = async function(req, res){
    const status = req.headers['status'];
    if(!status){
        return res.status(400).json(errorMessages.ALL_FIELDS_REQUIRED)
    } 

    const data = await Kyc.find({status});

    if(data.length == 0){
        return res.status(404).json(errorMessages.NOT_FOUND)
    }else{        
        return res.status(200).json(data)
    }
    

}