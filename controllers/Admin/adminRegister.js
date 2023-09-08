const AdminUser = require('../../models/AdminUser');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config({path:'../../.env'});
const logger = require('../User/logger');
module.exports.adminRegister = async function(req, res){
// try {
    logger.info(`Activated Admin Register Endpoint`)
    //input data
    const {name , email , password, role}  = req.body;
    logger.info(`Input - ${name} , ${email} , ${password}, ${role}}`)
    const token = req.body.token || req.query.token || req.headers["x-access-token"];
    //check for token provided or not
    if(!token){
        return res.status(401).json('Please Provide Token');
    }
    var userRole;
    try {
        //decode token signature
        const secret = process.env.SECRET_KEY;
        const decode = jwt.verify(token , secret);
        console.log(decode);
    //check for user role as per token
         userRole = decode.role;
    } catch (error) {
        return res.status(401).json(`Token Expired`)
    }
    logger.info(`User Role - ${userRole}`)
    //check condition user specific role
    if(userRole == "Super_Admin" || userRole == "super_admin"){
        createUser(name , email, password , role);
    }else if(userRole == "Admin" || userRole == "admin"){
        //admin can only create standard user
        if(role == "Standard" || role == "standard"){
            createUser(name , email, password , role);
        }else{
            logger.error(`You do not have access to create ${role} user`)
            return res.status(403).json(`You do not have access to create ${role} user`)
        }
    }else{
        logger.error(`You do not have access to create ${role} user`)
        return res.status(403).json(`You do not have access to create ${role} user`)
    }
    //define fucntion to create user
    async function createUser(name , email, password , role){
        if(!name || !email || !password || !role){
            //console.log('All fields are Mandatory');
            logger.error(`All fields are Mandatory`)
            return res.status(400).json({error:'All fields are Mandatory'})
        }
        //check for email or user exist
        const isExist = await AdminUser.findOne({email:email})
        if(isExist){
            logger.error(`Email already registered`)
            return res.status(422).json({error:'Email already registered'})
        }
        try {
            // //generate salt 
            // var salt = bcrypt.genSaltSync(20);
            // //encypt password by using bycrpt
            // var hashPassword = bcrypt.hashSync(password, salt);
            //create user in DB
            const userData = new  AdminUser({
                name , email , password , role
            })
            await userData.save();
            //console.log(userData);
            logger.info(`Output - ${userData}`)
            //response
            res.status(200).json(userData);
        } catch (error) {
            logger.error(error)
            return res.json(error);   
        }
    }
// } catch (error) {
//     logger.error(`Admin Register Endpoint Failed`)
//     return res.status(500).json("Something went wrong in Admin Register")
// }
}

