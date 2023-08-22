const Project = require('../../models/Project');

module.exports.filter_Project = async function(req, res){
try {
    const projectStatus = req.body.projectStatus || req.query.projectStatus || req.headers["project-status"]
    const projectData = await Project.find({projectStatus});
    
    if(projectData.length == 0){
        return res.status(404).json("No records available")
    }
    return res.json(projectData);
} catch (error) {
    return res.status(500).json("Something went wrong in fetching Filetred Projects")
}
}