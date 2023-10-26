const AdminUser = require('../../models/AdminUser');

module.exports.getAdminUserFilter = async function(req, res){
    const role = req.body.role || req.query.role || req.headers["role"]
    const userData = await AdminUser.find({role},{password:0});
       
    res.json(userData);
}