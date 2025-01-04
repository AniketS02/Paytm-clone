// backend/routes/user.js
const express = require('express');
const router = express.Router();
const zod = require("zod");
const jwt = require("jsonwebtoken");
const JWT_SECRET = require('../config');
const { authMiddleware } = require('../middleware');
const User = require('../db')

//signup
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
    const user = await User.findOne({ username: body.username })

    if (user._id) {
        return res.status(411).json({
            message: "Email already taken / Incorrect inputs"
        })
    }

    const dbUser = await User.create(body)
    // <------Account creation ------------>
    const userId = User._id
    await Account.create({
        userId,
        balance: 1 + Math.random() * 1000
    })

    //<------------------------------------------>
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

    const exsistingUser = await User.findOne({
        username: body.username,
        password: body.password
    })
    if (exsistingUser) {
        const token = jwt.sign({
            userId: User._id
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

//update data , put request
// update user password or firstName or lastName
const updatedUserSchema = zod.object({
    password: zod.string().optional(),
    firstName: zod.string().optional(),
    lastName: zod.string().optional()
})
router.put('/', authMiddleware, async (req, res) => {
    const body = req.body;
    const { success } = updatedUserSchema.safeParse(body);
    if (!success) {
        res.status(411).json({
            message: "Error while updating the information"
        })
    }

    await User.updateOne(req.body, {
        _id: req.userId
    })

    res.json({
        message: "Updated Successfully"
    })

})

//This is needed so users can search for their friends and send them money via firstName and lastName
router.get('/bulk', async (req, res) => {
    const filter = req.query.filter || "";

    const users = await User.find({
        $or: [{
            firstName: {
                "$regex": filter
            }
        }, {
            lastName: {
                "$regex": filter
            }
        }]
    })

    res.json({
        user: users.map(user => ({
            username: user.username,
            firstName: user.firstName,
            lastName: user.lastName,
            _id: user._id
        }))
    })
})
module.exports = router;

