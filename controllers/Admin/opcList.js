const OPC =  require('../../models/OPC');
const errorMessages = require('../../response/errorMessages');

module.exports.opcList = async function(req , res){
try {
    const {projectName , documentList} = req.body;

    try {
        const projectId = Date.now();
        const isExist = await OPC.findOne({projectName});
        if(isExist){
            return res.status(422).json(errorMessages.RECORD_ALREADY_EXIST);
        }
        const data = await OPC.create({
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