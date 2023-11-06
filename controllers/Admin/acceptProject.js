const Project = require('../../models/Project');
const errorMessages = require('../../response/errorMessages');
var CryptoJS = require("crypto-js");
const jwt = require('jsonwebtoken');
const successMessages = require('../../response/successMessages');
const AdminUser = require('../../models/AdminUser');
const logger = require('../User/logger');
require('dotenv').config({path:'../../.env'});

module.exports.acceptProject = async function(req , res){
    const {projectStatus ,projectId } = req.body;
        //user input
        var token = req.body.token || req.query.token || req.headers["x-access-token"];
        //check for valid response
        if(!token){
            return res.status(401).json(errorMessages.TOKEN_NOT_FOUND);
        }
        var userRole;
        try {
            //decode token signature
            const secret = process.env.SECRET_KEY;
             // Decrypt
             var bytes  = CryptoJS.AES.decrypt(token, secret);
             token = bytes.toString(CryptoJS.enc.Utf8);
            const decode = jwt.verify(token , secret);
            
        //check for user role as per token
             userRole = decode.role;
             var id =decode.id
             var acceptedBy = decode.email;
        } catch (error) {
            return res.status(401).json(errorMessages.TOKEN_EXPIRED)
        }

        try {
            var activeUser = await AdminUser.findById(id) 
             if(activeUser == null){
                logger.error(`In active Admin`)
                return res.status(401).json(errorMessages.ACCESS_DENIED)
            }
        } catch (error) {
            logger.error(errorMessages.SOMETHING_WENT_WRONG)
            return res.status(502).json(errorMessages.SOMETHING_WENT_WRONG)
        }


    if(!projectStatus || !projectId){
        return res.status(400).json(errorMessages.ALL_FIELDS_REQUIRED);
    }

    const isExist = await Project.findOne({projectId});
    console.log(isExist);
    if(isExist.projectStatus == 'New'){
        try {
            const updateData = await Project.findOneAndUpdate({projectId},{
                projectStatus,
                acceptedBy,
            },{new:true});
            return res.status(200).json(successMessages.RECORD_UPDATED_SUCCESSFULLY)
        } catch (error) {
            return res.status(502).json(errorMessages.BAD_GATEWAY)
        }
    }else{
        return res.status(403).json(errorMessages.ACCESS_DENIED);
    }
}