const Project = require('../../models/Project');
const errorMessages = require('../../response/errorMessages');

module.exports.getAllProjectByContact = async function(req , res){

    const contact = req.params.contact || req.body.contact || req.query.contact || req.headers["contact"];

    if(!contact){
        return res.status(400).json(errorMessages.ALL_FIELDS_REQUIRED);
    }

    const data =  await Project.find({contact});

    res.json(data);
}