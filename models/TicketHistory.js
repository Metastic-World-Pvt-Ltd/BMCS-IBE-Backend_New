const mongoose = require('mongoose');

const ticketSchema = new mongoose.Schema({
    contact:{
        type: String,
        required:true
    },
    ticketId:{
        type: String,
        required:true
    },
    status:{
        type: String,
        required:true
    },
},{
    timestamps:true
}
)


module.exports =mongoose.model('TicketHistory', ticketSchema)