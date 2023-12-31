const express=require('express');
const { verifyUser } = require('../middleware/verifyUser');
const { createSupportTicket } = require('../controllers/Support/createSupportTicket');
const { assignToMe } = require('../controllers/Support/assignToMe');
const { closeTicket } = require('../controllers/Support/closeTicket');
const { getAllSupportTicket } = require('../controllers/Support/getAllSupportTicket');
const { filterSupportTicket } = require('../controllers/Support/filterSupportTicket');
const { ticketComment } = require('../controllers/Support/ticketComment');
const { verifyAdminUser } = require('../middleware/verifyAdminUser');
const { filterTicketsAdmin } = require('../controllers/Support/filterTicketsAdmin');


const router=express.Router();
router.use(express.json())
router.use(express.urlencoded({extended:false}))

router.get('/',function(req, res){
    res.send('Support Ticket Home')
})

//create support ticket
router.post('/createticket', verifyUser , createSupportTicket);
//assign to me ticket
router.post('/assigntome', verifyUser , assignToMe);
//close ticket
router.post('/closeticket',verifyUser , closeTicket);
//get all support ticket
router.get('/alltickets',verifyAdminUser , getAllSupportTicket);
//get support filter ticket
router.get('/filtersupportticket',verifyUser, filterSupportTicket); 
//get admin support filter ticket
router.get('/adminfiltertickets',verifyUser, filterTicketsAdmin); 
//update comment in support ticket
router.post('/updatecomment', verifyUser , ticketComment)

module.exports = router;