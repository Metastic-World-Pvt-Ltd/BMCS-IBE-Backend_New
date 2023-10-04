const express=require('express');
const { verifyUser } = require('../middleware/verifyUser');
const { createSupportTicket } = require('../controllers/Support/createSupportTicket');
const { assignToMe } = require('../controllers/Support/assignToMe');
const { closeTicket } = require('../controllers/Support/closeTicket');


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

module.exports = router;