const express=require('express');
const { verifyUser } = require('../middleware/verifyUser');
const { createSupportTicket } = require('../controllers/Support/createSupportTicket');


const router=express.Router();
router.use(express.json())
router.use(express.urlencoded({extended:false}))

router.get('/',function(req, res){
    res.send('Support Ticket Home')
})

//create support ticket
router.post('/createticket', verifyUser , createSupportTicket);

module.exports = router;