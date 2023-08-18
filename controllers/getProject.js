const Project = require('../models/Project');

module.exports.getProject = async function(req, res){
try {
    const projectId = req.params.projectId;
    const projectData = await Project.findOne({projectId});
    // console.log(projectData);
    if(projectData == null){
        return res.status(404).json('No Record Found')
    }else{
        return res.status(200).json(projectData);
    }
} catch (error) {
    return res.status(500).json('Something wrong in Fetchingproject Data')
}
    
}