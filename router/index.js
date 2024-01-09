const express = require('express');
const cron = require('node-cron');

const router = express.Router();

console.log('Router Loaded SuccessFully!');


router.get('/', function(req, res){
    res.send(`Main Home Router`)
});
//Code to lapse referral Earning on 31st Match
async function lapseReferralPoints(){
    const Wallet = require('../models/Wallet');

    const data = await Wallet.updateMany({
        referralEarning:0
    })
}
cron.schedule('0 0 31 3 *', () => {
    // Your task logic here
    lapseReferralPoints();
    console.log('Running task on March 31st');
  }, {
    scheduled: true,
    timezone: 'Asia/Kolkata', // Provide your timezone (e.g., 'America/New_York')
  });
//end of lapse code



router.use('/user', require('./user'));
router.use('/admin',require('./admin'))
router.use('/ticket',require('./ticket'));
router.use('/support', require('./support'));

// for any further routes, access from here
// router.use('/routerName', require('./routerfile));y



module.exports = router;