const Project = require('../../models/Project');

module.exports.verifyProject = async function(req, res){
    const _id = req.params.id || req.body.id || req.query.id || req.headers["id"];
    const {projectStatus,comment} = req.body;
    console.log(_id, projectStatus);
    if(!_id || !projectStatus )
    if(projectStatus == "Verified" || projectStatus == "verified"){
        //const projectData = await Project.findByIdAndUpdate({_id},{projectStatus},{new:true})
        return res.status(200).json("ok");
    }else{
        if(!comment){
            return res.status(400).json("Comment is required")
        }else{
            const projectData = await Project.findByIdAndUpdate({_id},{comment},{new:true})
            return res.status(200).json(projectData);
        }

    }

}

