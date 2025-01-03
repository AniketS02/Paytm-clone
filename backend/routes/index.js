const express = require("express")
const router = express.Router() //syntax of creating a router 
module.exports = router;
const userRouter = require('./user')
router.use('user',userRouter)
// api/v1/
// router.get("/tranction") => ("/api/v1",)
