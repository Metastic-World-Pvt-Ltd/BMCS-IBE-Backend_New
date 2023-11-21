const SupportTicket = require('../../models/SupportTicket');
const errorMessages = require('../../response/errorMessages');
const successMessages = require('../../response/successMessages');
const logger = require('../User/logger');

module.exports.filterSupportTicket = async function(req , res){

    const status = req.params.status || req.body.status || req.query.status || req.headers["status"];

    const contact = req.params.status || req.body.status || req.query.status || req.headers["contact"];
    var query;
    if(!status){
         query = {contact:contact};
    }else{
        // Define the query
        query = {status:status , contact:contact};
    }
     

    const data = await SupportTicket.find(query);
    console.log(data);
    return res.status(200).json(data);
    
}