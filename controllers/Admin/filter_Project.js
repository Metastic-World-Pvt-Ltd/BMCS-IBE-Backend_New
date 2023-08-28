const Project = require('../../models/Project');
const logger = require("../logger");
module.exports.filter_Project = async function(req, res){
try {
    logger.info(`Activated Filter Project Endpoint`)
    //check user input project status to filet accordingly
    const projectStatus = req.body.projectStatus || req.query.projectStatus || req.headers["project-status"]
    logger.info(`Input - ${projectStatus}`)
    //find the projects as per user input status
    const projectData = await Project.find({projectStatus});
    //check for record found or not
    if(projectData.length == 0){
        logger.error(`No records available"`)
        return res.status(404).json("No records available")
    }
    logger.info(`Output - ${projectData}`)
    //response
    return res.status(200).json(projectData);
} catch (error) {
    logger.error(`Filter Project Endpoint Failed`)
    return res.status(500).json("Something went wrong in fetching Filetred Projects")
}
}