const Project = require('../../models/ClientProduct');
const logger = require('../User/logger');
const errorMessages = require('../../response/errorMessages');
const successMessages = require('../../response/successMessages');
module.exports.filter_Project = async function(req, res){
try {
    logger.info(`Start`);
    logger.info(successMessages.FILTER_PROJECT_ACTIVATED)
    //check user input project status to filet accordingly
    const projectStatus = req.body.projectStatus || req.query.projectStatus || req.headers["project-status"]
    logger.info(`Input - ${projectStatus}`)
    //find the projects as per user input status
    const projectData = await Project.find({projectStatus});
    //check for record found or not
    if(projectData.length == 0){
        logger.error(errorMessages.NOT_FOUND)
        return res.status(404).json(errorMessages.NOT_FOUND)
    }
    logger.info(`Output - ${projectData}`)
    logger.info(`End`);
    //response
    return res.status(200).json(projectData);
} catch (error) {
    logger.error(errorMessages.FILTER_PROJECT_FAILED)
    return res.status(500).json(errorMessages.INTERNAL_ERROR)
}
}