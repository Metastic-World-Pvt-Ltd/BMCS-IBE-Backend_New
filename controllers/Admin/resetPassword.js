const AdminUser = require('../../models/AdminUser');
const jwt = require('jsonwebtoken');
require('dotenv').config({path:'../../.env'});
const bcrypt = require('bcryptjs');
module.exports.resetPassword = async function(req, res){
    const token = req.body.token || req.query.token || req.headers["x-access-token"];
    const {email, password} = req.body;
    if(!token){
        return res.status(401).json('Please Provide Token');
    }
    
    const secret = process.env.SECRET_KEY;
    const decode = jwt.verify(token , secret);
    
    const userRole = decode.role;
    
    if(userRole == "Super_Admin" || userRole == "super_admin"){
        if(!email || !password){
            return res.status(400).json("Email & New Password both required")
        }else{
            var salt = bcrypt.genSaltSync(20);
            var hashPassword = bcrypt.hashSync(password, salt);
            
            const userData = await AdminUser.findOneAndUpdate({email},{password:hashPassword},{new:true})
            console.log(userData);
            if(userData == null){
                return res.status(404).json("NO Record Found")
            }else{
                return res.status(200).json("Password has been reset")
            }
        }

    }else{
        return res.status(401).json(`Anauthorized Access`)
    }
}