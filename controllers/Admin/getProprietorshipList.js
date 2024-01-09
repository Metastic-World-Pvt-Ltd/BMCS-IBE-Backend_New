const PROPRIETORSHIP = require('../../models/PROPRIETORSHIP');
const errorMessages = require('../../response/errorMessages');

module.exports.getProprietorshipList = async function(req , res){
    const projectName =  req.headers['project-name'];

    if(!projectName){
        return res.status(400).json(errorMessages.ALL_FIELDS_REQUIRED);
    }

    const data = await PROPRIETORSHIP.findOne({projectName});

    if(data){
        return res.status(200).json(data);
    }else{
        return res.status(404).json(errorMessages.NOT_FOUND);
    }
}