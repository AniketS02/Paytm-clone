const mongoose = require("mongoose")
mongoose.connect("mongodb+srv://saxenaaniket02:nvyV6qAQgB74ZPg7@cluster0.fyfx5.mongodb.net/PayTm")

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        minLength: 3,
        maxLength: 30
    },
    firstName: {
        type: String,
        required: true,
        trim: true,
        maxLength: 50
    },
    lastName: {
        type: String,
        required: true,
        trim: true,
        maxLength: 50
    }, password: {
        type: String,
        required: true,
        trim: true,
        minLength: 6,
    },
})

const AccountSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId, // Reference to User model
        ref: 'User',
        required: true
    }
    ,
    balance: {
        type: Number,
        required: true
    }
})

const User = mongoose.model('User', UserSchema)
const Account = mongoose.model('Account', AccountSchema)

module.exports = {
    User,
    Account
}


