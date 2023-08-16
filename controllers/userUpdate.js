const User = require('../models/User');
const verifyUser = require('../middleware/verifyUser');
module.exports.userUpdate = async function(req, res){
    try {
        if(!req.body){
            res.status(400).json('Enter valid field to update details')
        }
        const _id = req.params.id;
        const middlewareData = verifyUser.data;
        const findData = await User.findById({_id});
        console.log(middlewareData);
        console.log(findData);
        
        if(middlewareData.contact == findData.contact && middlewareData.firstName == findData.firstName){
            const updateData =  await User.findByIdAndUpdate(_id,req.body);
            if(updateData){
                res.status(200).json(updateData);
            }else{
                res.status(404).json('User does not exist')
            }
        }else{
            res.status(401).json('seems you do not have access to perform this action')
        }

        

    } catch (error) {
        res.status(500).json('Something went wrong in updating user')
    }
}