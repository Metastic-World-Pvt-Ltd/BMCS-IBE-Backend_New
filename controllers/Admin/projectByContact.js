const Project = require('../../models/Project');
const logger = require('../User/logger');
const errorMessages = require('../../response/errorMessages');
const successMessages = require('../../response/successMessages');
module.exports.projectByContact = async function(req, res){
try {
    logger.info(`Start`);
    //logger.info(successMessages.FILTER_PROJECT_ACTIVATED)
    //check user input project status to filet accordingly
    const contact = req.body.contact || req.query.contact || req.headers["contact"]
    logger.info(`Input - ${contact}`)
    //find the projects as per user input status
    const projectData = await Project.find({contact});
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