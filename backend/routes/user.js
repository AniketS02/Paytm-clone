// backend/routes/user.js
const express = require('express');
const router = express.Router();
const zod = require("zod");
const jwt = require("jsonwebtoken");
const JWT_SECRET = require('../config');
const { authMiddleware } = require('../middleware');
const mongoose = require('mongoose');
const { User, Account } = require('../db');

//signup
//zod validation
const signupBody = zod.object({
    username: zod.string().email(),
    firstName: zod.string(),
    lastName: zod.string(),
    password: zod.string()
})

router.post("/signup", async (req, res) => {
    const { success } = signupBody.safeParse(req.body)
    if (!success) {
        return res.status(411).json({
            message: "Email already taken / Incorrect inputs , parsing failed"
        })
    }

    const existingUser = await User.findOne({
        username: req.body.username
    })

    if (existingUser) {
        return res.status(411).json({
            message: "Email already taken/Incorrect inputs"
        })
    }

    const user = await User.create({
        username: req.body.username,
        password: req.body.password,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
    })
    console.log(user);
    user.save();
    const userId = user._id;

    await Account.create({
        userId,
        balance: 1 + Math.random() * 10000
    })

    const token = jwt.sign({
        user
    }, JWT_SECRET);

    res.json({
        message: "User created successfully",
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

    const updatedData = await User.updateOne(
        { _id: req.userId }, // Filter
        { $set: req.body }   // Update object
    );



    res.json({
        message: "Updated Successfully"
    })

})

//This is needed so users can search for their friends and send them money via firstName and lastName
router.get("/bulk", async (req, res) => {
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

