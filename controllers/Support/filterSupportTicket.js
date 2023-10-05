const SupportTicket = require('../../models/SupportTicket');
const errorMessages = require('../../response/errorMessages');
const successMessages = require('../../response/successMessages');
const logger = require('../User/logger');

module.exports.filterSupportTicket = async function(req , res){

    const status = req.params.status || req.body.status || req.query.status || req.headers["status"];

    const data = await SupportTicket.find({status});

    return res.status(200).json(data);
    
}