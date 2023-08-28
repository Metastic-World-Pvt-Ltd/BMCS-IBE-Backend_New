const Project = require('../../models/Project');
const logger = require("../logger");
module.exports.verifyProject = async function(req, res){
try {
    logger.info(`Activated Verify Project Endpoint`)
    //input projectID
    const _id = req.params.id || req.body.id || req.query.id || req.headers["id"];
    logger.info(`Id - ${_id}`)
    //project status and comment
    const {projectStatus,comment} = req.body;
    logger.info(`Input - ${req.body}`)
    //console.log(_id, projectStatus);
    //check for project id and status
    if(!_id || !projectStatus ){
        logger.error(`Id and project status is required`)
        return res.status(400).json("Id and project status is required")
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
            logger.error(`Comment is required`)
            res.status(400).json("Comment is required")
        }else{
            //updste the data into DB
            const projectData = await Project.findByIdAndUpdate({_id},{comment},{new:true})
            logger.info(`Output - ${projectData}`)
            //reponse
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

