const Project = require('../../models/Project');
const jwt = require('jsonwebtoken');
require('dotenv').config({path:'../../.env'});

module.exports.superAdminConsole = async function(req, res){
    const token = req.body.token || req.query.token || req.headers["x-access-token"];
    
    if(!token){
        return res.status(401).json('Please Provide Token');
    }
    const secret = process.env.SECRET_KEY;
    const decode = jwt.verify(token , secret);
    
    const userRole = decode.role;
    if(userRole == "Super_Admin" || userRole == "super_admin"){
        const projectData = await Project.find()
        if(projectData.length == 0){
            return res.status(404).json("NO Projects Available")
        }else{
            return res.status(200).json(projectData)
        }
    }else{
        return res.status(401).json(`Anauthorized Access`)
    }
    
}
