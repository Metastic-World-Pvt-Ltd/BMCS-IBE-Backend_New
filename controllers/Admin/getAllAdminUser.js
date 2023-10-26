const AdminUser = require('../../models/AdminUser');

module.exports.getAllAdminUser = async function(req, res){

    const userData = await AdminUser.find({},{password:0});
       
    res.json(userData);
}