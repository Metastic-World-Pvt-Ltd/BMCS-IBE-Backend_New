const express = require('express');

const router = express.Router();

console.log('Router Loaded SuccessFully!');


router.get('/', function(req, res){
    res.send(`Main Home Router`)
});
router.use('/user', require('./user'));
router.use('/admin',require('./admin'))
router.use('/ticket',require('./ticket'));
router.use('/support', require('./support'));

// for any further routes, access from here
// router.use('/routerName', require('./routerfile));y



module.exports = router;