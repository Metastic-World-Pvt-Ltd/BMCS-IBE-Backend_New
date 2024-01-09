const projectDocuments = require('../../models/projectDocuments');

module.exports.addDocumentList = async function(req, res){
    const {projectName , documentList} = req.body;
   
    const projectId = Date.now();
    const data = await projectDocuments.create({
        projectId ,projectName , documentList
    })

    res.json(data);
}