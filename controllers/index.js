//bringing in express for handing routes -tb
const router = require('express').Router();
//setting up apiRoutes and its location folder -tb
const apiRoutes = require('./api');
//setting homeRoute and its location as a route -tb
const homeRoutes = require('./homeRoutes');

//using middleware to handle the GET request -tb
// base URL for main route -tb
router.use('/', homeRoutes);
//base URL with main route and other routes -tb
router.use('/api', apiRoutes)

//exporting Router -tb
module.exports = router;
