const Project = require('../../models/Project');
const logger = require("../logger");
module.exports.verifyProject = async function(req, res){
try {
    logger.info(`Activated Verify Project Endpoint`)
    const _id = req.params.id || req.body.id || req.query.id || req.headers["id"];
    logger.info(`Id - ${_id}`)
    const {projectStatus,comment} = req.body;
    logger.info(`Input - ${req.body}`)
    //console.log(_id, projectStatus);
    if(!_id || !projectStatus ){
        logger.error(`Id and project status is required`)
        return res.status(400).json("Id and project status is required")
    }
    if(projectStatus == "Verified" || projectStatus == "verified"){
        const projectData = await Project.findByIdAndUpdate({_id},{projectStatus},{new:true})
        logger.info(`Output - ${projectData}`)
         res.status(200).json(projectData);
    }else if(projectStatus == "Re_Verified" || projectStatus == "re_verified"){
        if(!comment){
            logger.error(`Comment is required`)
            res.status(400).json("Comment is required")
        }else{
            const projectData = await Project.findByIdAndUpdate({_id},{comment},{new:true})
            logger.info(`Output - ${projectData}`)
            res.status(200).json(projectData);
        }

    }else{
        logger.error(`Invalid Input`)
        return res.status(400).json("Invalid Input")
    }
} catch (error) {
    logger.error(`Verify Project Endpoint Failed`)
    return res.status(500).json("Something went wrong in Verify Project")
}

}

