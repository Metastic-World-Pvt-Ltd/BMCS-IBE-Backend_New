const Project = require('../models/Project');
const logger = require('./logger');

module.exports.getProject = async function(req, res){
try {
    logger.info(`Activated Get Project Endpoint`)
    const projectId = req.params.projectId;
    logger.info(`Project Id - ${projectId}`)
    const projectData = await Project.findOne({projectId});
    // console.log(projectData);
    if(projectData == null){
        logger.error(`No Record Found`)
        return res.status(404).json('No Record Found')
    }else{
        logger.info(`Output - ${projectData}`)
        return res.status(200).json(projectData);
    }
} catch (error) {
    logger.error(`Get Project Endpoint Failed`)
    return res.status(500).json('Something wrong in Fetchingproject Data')
}
    
}