const express = require("express")
const router = express.Router() //syntax of creating a router 
module.exports = router;
const userRouter = require('./user')
const accountRouter = require('./account')
router.use('/user',userRouter)
router.use('/account',accountRouter)

module.exports = router
// api/v1/
// router.get("/tranction") => ("/api/v1",)
