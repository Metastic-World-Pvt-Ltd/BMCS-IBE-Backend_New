const User = require('../models/User');
module.exports.userUpdate = async function(req, res){
    try {
        if(!req.body){
            res.status(400).json('Enter valid field to update details')
        }
        const _id = req.params.id;
        const updateData =  await User.findByIdAndUpdate(_id,req.body);
        if(updateData){
            res.status(200).json(updateData);
        }else{
            res.status(404).json('User does not exist')
        }
        

    } catch (error) {
        res.status(500).json('Something went wrong in updaing user')
    }
}