const AdminUser = require('../../models/AdminUser');
const bcrypt = require('bcryptjs');
module.exports.adminRegister = async function(req, res){
    const {name , email , password, role}  = req.body;
    console.log("inside admin reg");
    if(!name || !email || !password || !role){
        //console.log('All fields are Mandatory');
        return res.status(400).json({error:'All fields are Mandatory'})
    }

    const isExist = await AdminUser.findOne({email:email})
    if(isExist){
        return res.status(422).json({error:'Email already registered'})
    }
    try {
        var salt = bcrypt.genSaltSync(20);
        var hashPassword = bcrypt.hashSync(password, salt);
        const userData = await AdminUser.create({
            name , email , password:hashPassword , role
        })
        console.log(userData);
        res.status(200).json(userData);
    } catch (error) {
        return res.json(error);   
    }
}