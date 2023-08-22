const Project = require('../../models/Project');

module.exports.verifyProject = async function(req, res){
    const _id = req.params.id || req.body.id || req.query.id || req.headers["id"];
    const {projectStatus,comment} = req.body;
    console.log(_id, projectStatus);
    if(!_id || !projectStatus ){
        return res.status(400).json("Id and project status is required")
    }
    if(projectStatus == "Verified" || projectStatus == "verified"){
        const projectData = await Project.findByIdAndUpdate({_id},{projectStatus},{new:true})
         res.status(200).json(projectData);
    }else if(projectStatus == "Re_Verified" || projectStatus == "re_verified"){
        if(!comment){
            res.status(400).json("Comment is required")
        }else{
            const projectData = await Project.findByIdAndUpdate({_id},{comment},{new:true})
            res.status(200).json(projectData);
        }

    }else{
        return res.status(400).json("Invalid Response")
    }

}

