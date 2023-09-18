const Project = require('../../models/Project');
const logger = require('../User/logger');
const errorMessages = require('../errorMessages');
const successMessages = require('../successMessages');
module.exports.verifyProject = async function(req, res){
try {
    logger.info(successMessages.VERIFY_PROJECT_ACTIVATED)
    //input projectID
    const _id = req.params.id || req.body.id || req.query.id || req.headers["id"];
    logger.info(`Id - ${_id}`)
    //project status and comment
    const {projectStatus,comment} = req.body;
    logger.info(`Input - ${req.body}`)
    //console.log(_id, projectStatus);
    //check for project id and status
    if(!_id || !projectStatus ){
        logger.error(errorMessages.PROJECT_ID_AND_STATUS_REQUIRED)
        return res.status(400).json(errorMessages.PROJECT_ID_AND_STATUS_REQUIRED)
    }
    const checkStatus = await Project.findById({_id})
    console.log(checkStatus);
    if(checkStatus.projectStatus == "Verified"){
        return res.status(400).json(errorMessages.PROJECT_ALREADY_VERIFIED)
    }
    //check for status and update data as per status
    if(projectStatus == "Verified" || projectStatus == "verified"){
        //update data
        const projectData = await Project.findByIdAndUpdate({_id},{projectStatus},{new:true})
        logger.info(`Output - ${projectData}`)
        //response
         res.status(200).json(projectData);
         //check status update comment data and return response
    }else if(projectStatus == "Re_Verified" || projectStatus == "re_verified"){
        //check if comment provided or not
        if(!comment){
            logger.error(errorMessages.COMMENT_REQUIRED)
            res.status(400).json(errorMessages.COMMENT_REQUIRED)
        }else{
            //updste the data into DB
            const projectData = await Project.findByIdAndUpdate({_id},{comment},{new:true})
            logger.info(`Output - ${projectData}`)
            //reponse
            res.status(200).json(projectData);
        }

    }else{
        logger.error(errorMessages.INVALID_INPUT)
        return res.status(400).json(errorMessages.INVALID_INPUT)
    }
} catch (error) {
    logger.error(errorMessages.VERIFY_PROJECT_FAILED)
    return res.status(500).json(errorMessages.INTERNAL_ERROR)
}

}

