//bringing in router express package
const router = require('express').Router();
//bringing in data from user route
const userRoutes = require('./userRoutes');
const dashboardRoute = require('./dashboardRoute')

router.use('/user', userRoutes)
router.use('/dashboard', dashboardRoute)

//exporting routes
module.exports = router;
