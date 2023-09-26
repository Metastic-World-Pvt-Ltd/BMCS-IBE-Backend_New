const Enquiry = require('../../models/Enquiry');
const errorMessages = require('../../response/errorMessages');

module.exports.getTicketStatus =  async function(req, res){
    const contact = req.headers['contact'];
    
    if(!contact){
        return res.status(400).json(errorMessages.CONTACT_IS_REQUIRED);
    }
    try {
        const data = await Enquiry.findOne({contact});
        res.status(200).json(data.projectStatus);
    } catch (error) {
        return res.json(error);
    }
}