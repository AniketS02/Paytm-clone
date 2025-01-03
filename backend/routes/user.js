// backend/routes/user.js
const express = require('express');
const router = express.Router();
const zod = require("zod");
const jwt = require("jsonwebtoken");
const JWT_SECRET = require('../config');

const singupSchema = zod.object({
    username: zod.string().email(),
    firstName: zod.string(),
    lastName: zod.string(),
    password: zod.string().min(6).max(8)
})
router.post('/signup', async (req, res) => {
    const body = req.body;
    const { success } = singupSchema.safeParse(req.body)
    if (!success) {
        return res.status(411).json({
            message: "Email already taken / Incorrect inputs"
        })
    }
    const user = await user.findOne({ username: body.username })

    if (user._id) {
        return res.status(411).json({
            message: "Email already taken / Incorrect inputs"
        })
    }

    const dbUser = await user.create(body)
    const token = jwt.sign({
        userId: dbUser._id
    }, JWT_SECRET)
    res.status(200).json({
        messge: "User created successfully",
        token: token
    })

})

//signin
const signinSchema = zod.object({
    username: zod.string().email(),
    password: zod.string()
})
router.post('/signin', async (req, res) => {
    const body = req.body;
    const { success } = signinSchema.safeParse(req.body);
    if (!success) {
        res.status.json({
            message: "Error while logging in"
        })
    }

    const exsistingUser = await user.findOne({
        username: body.username,
        password: body.password
    })
    if (exsistingUser) {
        const token = jwt.sign({
            userId: user._id
        }, JWT_SECRET);

        res.json({
            token: token
        })
        return;
    }
    res.status(411).json({
        message: "Error while logging in"
    })
})
module.exports = router;

