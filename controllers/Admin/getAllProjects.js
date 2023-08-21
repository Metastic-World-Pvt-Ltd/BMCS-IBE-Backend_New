const Project = require('../../models/Project');

module.exports.getAllProjects = async function(req, res){
    try {
        const projectData = await Project.find();
        
        if(projectData.length == 0){
            return res.status(404).json('No Record Found');
        }else{
            return res.status(200).json(projectData);
        }
        
    } catch (error) {
        return res.status(500).json("Something wrong in Fetching Porjects")
    }
}