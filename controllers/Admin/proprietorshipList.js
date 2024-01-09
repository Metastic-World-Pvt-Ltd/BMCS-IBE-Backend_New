const PROPRIETORSHIP =  require('../../models/PROPRIETORSHIP');

module.exports.proprietorshipList = async function(req , res){
    const {projectName , documents} = req.body;
    
    const projectId = Date.now();

    const data = await PROPRIETORSHIP.create({
        projectId ,projectName ,documents
    })

    res.json(data);
}