const projectDocuments =  require('../../models/projectDocuments');

module.exports.updateDocumentList = async function(req, res){
    const {projectId ,name} = req.body;

    const project = projectDocuments.findOneAndUpdate(
        { projectId },
      {
        $push: {
          documentList: {
            name:name,
          },
        },
      }
    )

    // projectDocuments.documentList.push(newDocuments);

    // const data =    await project.save();
    res.json(project)
}