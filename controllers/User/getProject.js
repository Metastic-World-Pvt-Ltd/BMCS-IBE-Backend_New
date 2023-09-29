const Project = require('../../models/Project');
const errorMessages = require('../../response/errorMessages');
const successMessages = require('../../response/successMessages');
const logger = require('./logger');

module.exports.getProject = async function(req, res){
try {
    logger.info(`Start`);
    logger.info(successMessages.GET_PROJECT_ACTIVATED)
    //project Id input
    const projectId = req.params.projectId;
    logger.info(`Project Id - ${projectId}`)
    //check for projectID exist or not in DB
    const projectData = await Project.findOne({projectId});
    // console.log(projectData);
    //check for records
    if(projectData == null){
        logger.error(errorMessages.NOT_FOUND)
        return res.status(404).json(errorMessages.NOT_FOUND)
    }else{
        //send response as data found
        logger.info(`Output - ${projectData}`)
        logger.info(`End`);
        return res.status(200).json(projectData);
    }
} catch (error) {
    logger.error(errorMessages.GET_PROJECT_FAILED)
    return res.status(500).json(errorMessages.INTERNAL_ERROR)
}
    
}