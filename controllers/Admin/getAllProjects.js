const Project = require('../../models/Project');
const logger = require('../User/logger');
const errorMessages = require('../../response/errorMessages');
const successMessages = require('../../response/successMessages');
module.exports.getAllProjects = async function(req, res){
    try {
        logger.info(`Start`);
        logger.info(successMessages.GET_ALL_PROJECT_ACTIVATED)
        //check for projects in DB
        const projectData = await Project.find();
        //check for record found or not
        if(projectData.length == 0){
            logger.error(errorMessages.NOT_FOUND)
            return res.status(404).json(errorMessages.NOT_FOUND);
        }else{
            logger.info(`Output - ${projectData}`)
            logger.info(`End`);
            //reponse
            return res.status(200).json(projectData);
        }
        
    } catch (error) {
        logger.error(errorMessages.GET_ALL_PROJECT_FAILED)
        return res.status(500).json(errorMessages.INTERNAL_ERROR)
    }
}