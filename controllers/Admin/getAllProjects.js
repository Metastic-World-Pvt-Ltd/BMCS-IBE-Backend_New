const Project = require('../../models/Project');
const logger = require("../logger");
module.exports.getAllProjects = async function(req, res){
    try {
        logger.info(`Activated Get All Project Endpoint`)
        const projectData = await Project.find();
        
        if(projectData.length == 0){
            logger.error(`No Record Found`)
            return res.status(404).json('No Record Found');
        }else{
            logger.info(`Output - ${projectData}`)
            return res.status(200).json(projectData);
        }
        
    } catch (error) {
        logger.error(`Get All Project Endpoint Failed`)
        return res.status(500).json("Something wrong in Fetching Porjects")
    }
}