const Wallet = require('../../models/Wallet');
const errorMessages = require('../../response/errorMessages');

module.exports.getWallet = async function(req , res){
    const contact = req.params.contact || req.body.contact || req.query.contact || req.headers["contact"];

    if(!contact){
        return res.status(400).json(errorMessages.ALL_FIELDS_REQUIRED);
    }

    const data = await Wallet.find({contact});

    res.status(200).json(data);
}
