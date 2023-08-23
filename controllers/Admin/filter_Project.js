const Project = require('../../models/Project');
const logger = require("../logger");
module.exports.filter_Project = async function(req, res){
try {
    logger.info(`Activated Filter Project Endpoint`)
    const projectStatus = req.body.projectStatus || req.query.projectStatus || req.headers["project-status"]
    logger.info(`Input - ${projectStatus}`)
    const projectData = await Project.find({projectStatus});
    
    if(projectData.length == 0){
        logger.error(`No records available"`)
        return res.status(404).json("No records available")
    }
    logger.info(`Output - ${projectData}`)
    return res.json(projectData);
} catch (error) {
    logger.error(`Filter Project Endpoint Failed`)
    return res.status(500).json("Something went wrong in fetching Filetred Projects")
}
}