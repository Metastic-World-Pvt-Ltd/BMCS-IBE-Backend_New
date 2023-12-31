const PROPRIETORSHIP =  require('../../models/PROPRIETORSHIP');
const errorMessages = require('../../response/errorMessages');

module.exports.proprietorshipList = async function(req , res){
try {
    const {projectName , documentList} = req.body;

    try {
        const projectId = Date.now();
        const isExist = await PROPRIETORSHIP.findOne({projectName});
        if(isExist){
            return res.status(422).json(errorMessages.RECORD_ALREADY_EXIST);
        }
        const data = await PROPRIETORSHIP.create({
            projectId ,projectName ,documentList
        })
    
        res.status(200).json(data);
    } catch (error) {
        return res.status(502).json(errorMessages.BAD_GATEWAY)
    }
} catch (error) {
    return res.status(500).json(errorMessages.INTERNAL_ERROR);
}
}