const SupportTicket = require('../../models/SupportTicket');
const errorMessages = require('../../response/errorMessages');
const successMessages = require('../../response/successMessages');
const logger = require('../User/logger');

module.exports.filterTicketsAdmin = async function(req , res){

// try {
    const status = req.params.status || req.body.status || req.query.status || req.headers["status"];

    const contact = req.params.status || req.body.status || req.query.status || req.headers["contact"];
    
    const page = parseInt(req.query.page) || 1;
    const limit = 8;

    if(!status){
         return res.status(400).json(errorMessages.ALL_FIELDS_REQUIRED)
    }
    // try {
        const countData = await SupportTicket.find({status});
        const count = countData.length;
    
        const data = await SupportTicket.find({status})
        .skip((page -1) * limit)
        .limit(limit)

        console.log(data);
        if(data.length != 0){
            return res.status(200).json({
                page,
                totalPages: Math.ceil(count / limit),
                'Tickets':data
            });
        }else{
            return res.status(404).json(errorMessages.NOT_FOUND);
        }
//     } catch (error) {
//         logger.error(error)
//         return res.status(502).json(errorMessages.BAD_GATEWAY)
//     }
// } catch (error) {
//     return res.status(500).json(errorMessages.INTERNAL_ERROR)
// }
    
    
}