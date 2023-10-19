const User = require("../../models/User");
const errorMessages = require("../../response/errorMessages");

module.exports.totalRef = async function(req , res){
    const contact = req.params.contact || req.body.contact || req.query.contact || req.headers["contact"];
    console.log(contact);
    if(!contact){
        return res.status(422).json(errorMessages.CONTACT_IS_REQUIRED);
    }

    const isExist = await User.findOne({contact});

    if(!isExist){
        return res.status(404).json(errorMessages.NOT_FOUND);
    }
    const refCount = isExist.refCount;

    return res.status(200).json(refCount);
}