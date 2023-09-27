const PIN = require('../../models/PIN');
const errorMessages = require('../../response/errorMessages');
const successMessages = require('../../response/successMessages');

module.exports.generatePin = async function(req, res){
    const {contact , pin} = req.body;
    if(!contact || !pin){
        return res.status(400).json(errorMessages.ALL_FIELDS_REQUIRED);
    }
    const isExist = await PIN.findOne({contact})
    if(isExist){
        return res.status(422).json(errorMessages.CONTACT_ALREADY_EXIST);
    }
    const data =  new PIN({
        contact , PIN:pin , 
    })
    await data.save();

    res.status(200).json(successMessages.RECORD_ADDED_SUCCESSFULLY)
}