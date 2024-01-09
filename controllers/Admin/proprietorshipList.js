const PROPRIETORSHIP =  require('../../models/PROPRIETORSHIP');
const errorMessages = require('../../response/errorMessages');

module.exports.proprietorshipList = async function(req , res){
    const {projectName , documentList} = req.body;

    const projectId = Date.now();
    const isExist = await PROPRIETORSHIP.findOne({projectName});
    if(isExist){
        return res.status(422).json(errorMessages.RECORD_ALREADY_EXIST);
    }
    const data = await PROPRIETORSHIP.create({
        projectId ,projectName ,documentList
    })

    res.json(data);
}