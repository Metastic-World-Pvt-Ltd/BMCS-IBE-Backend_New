const express = require('express');

const router = express.Router();

console.log('router loaded');


router.get('/', function(req, res){
    res.send(`Main Home Router`)
});
router.use('/user', require('./user'));
router.use('/admin',require('./admin'))

// for any further routes, access from here
// router.use('/routerName', require('./routerfile));


module.exports = router;