const AdminUser = require('../../models/AdminUser');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config({path:'../../.env'});
const logger = require("../logger");
module.exports.adminRegister = async function(req, res){
try {
    logger.info(`Activated Admin Register Endpoint`)
    const {name , email , password, role}  = req.body;
    logger.info(`Input - ${name , email , password, role}`)
    const token = req.body.token || req.query.token || req.headers["x-access-token"];
   
    if(!token){
        return res.status(401).json('Please Provide Token');
    }
    const secret = process.env.SECRET_KEY;
    const decode = jwt.verify(token , secret);
    
    const userRole = decode.role;
    logger.info(`User Role - ${userRole}`)
    if(userRole == "Super_Admin" || userRole == "super_admin"){
        createUser(name , email, password , role);
    }else if(userRole == "Admin" || userRole == "admin"){
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

    async function createUser(name , email, password , role){
        if(!name || !email || !password || !role){
            //console.log('All fields are Mandatory');
            logger.error(`All fields are Mandatory`)
            return res.status(400).json({error:'All fields are Mandatory'})
        }
    
        const isExist = await AdminUser.findOne({email:email})
        if(isExist){
            logger.error(`Email already registered`)
            return res.status(422).json({error:'Email already registered'})
        }
        try {
            var salt = bcrypt.genSaltSync(20);
            var hashPassword = bcrypt.hashSync(password, salt);
            const userData = await AdminUser.create({
                name , email , password:hashPassword , role
            })
            //console.log(userData);
            logger.info(`Output - ${userData}`)
            res.status(200).json(userData);
        } catch (error) {
            logger.error(error)
            return res.json(error);   
        }
    }
} catch (error) {
    logger.error(`Admin Register Endpoint Failed`)
    return res.status(500).json("Something went wrong in Admin Register")
}
}

