const express = require('express');
const { authMiddleware } = require('../middleware');
const router = express.Router();
const mongoose = require('mongoose')
const Account = require('../db')

// getting the user balance
router.get('/balance', authMiddleware , async (req,res) => {
    const account = await Account.findOne({userId : req.userId})
    res.json({
        balance : account.balance
    })
})

// An endpoint for user to transfer money to another account\
router.post('/transfer',authMiddleware, async (req,res) =>{
    const session = await mongoose.startSession();
    session.startTransaction();
    const {amount , toAccount} = req.body;
    const fromAccount = await Account.findOne({userId : req.userId})
    if(!fromAccount || fromAccount.balance < amount){
        res.json({
            message : "Insufficient Balance or account is invalid"
    })
    }

    const recieversAccount = await Account.findOne({
        userId : toAccount
    }).session(session)

    if(!recieversAccount){
        res.status(400).json({
            message : "Account not found"
        })
    }

    await Account.updateOne({
        userId : req.userId
    },{
        $inc: {
            balance : -amount
        }
    }).session(session)

    await Account.updateOne({
        userId: toAccount
    }, {
        $inc: {
            balance: amount
        }
    }).session(session)

    session.commitTransaction();
    res.json({
        message: "Transfer successful"
    })
})
module.exports = router