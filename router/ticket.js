const express=require('express');
const { verifyUser } = require('../middleware/verifyUser');
const { getTicketById } = require('../controllers/Ticket/getTicketById');
const { getAllTickets } = require('../controllers/Ticket/getAllTickets');
const { createTicket } = require('../controllers/Ticket/createTicket');
const { getTicketStatus } = require('../controllers/Ticket/getTicketStatus');
const { getTicketHistory } = require('../controllers/Ticket/getTicketHistory');
const { getDirectTickets } = require('../controllers/Ticket/getDirectTickets');

const router=express.Router();
router.use(express.json())
router.use(express.urlencoded({extended:false}))

router.get('/',function(req, res){
    res.send('Ticket Home')
})

//create ticket from user
router.post('/enquirynow',verifyUser , createTicket);
//get ticket data by Id
router.get('/getticket/:id',verifyUser , getTicketById);
//Get all tickets
router.get('/getallticket',verifyUser, getAllTickets);
//get ticket status by contact
router.get('/getstatus',verifyUser, getTicketStatus);
//get ticket history by ticket id
router.get('/tickethistory/:id',verifyUser , getTicketHistory);
//Get direct ticket without referral
router.get('/directticket',verifyUser , getDirectTickets);

module.exports = router;