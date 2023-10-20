const Ticket = require('../../models/Ticket');
const errorMessages = require('../../response/errorMessages')
module.exports.getUserEnquiery = async function(req, res){
    const contact = req.params.contact || req.body.contact || req.query.contact || req.headers["contact"];

    if(!contact){
        return res.status(400).json(errorMessages.ALL_FIELDS_REQUIRED);
    }

    const data = await Ticket.find({contact});

    res.json(data);
}