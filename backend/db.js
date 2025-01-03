const mongoose = require("mongoose")
mongoose.connect("mongodb+srv://saxenaaniket02:nvyV6qAQgB74ZPg7@cluster0.fyfx5.mongodb.net/Paytm")

const UserSchema = new mongoose.Schema({
    username: { 
        type : String,
        required : true,
        unique : true,
        trim : true ,
        lowercase : true,
        minLength : 3,
        maxLength : 30
     },
    password:{
        type:string,
        required : true,
        trim : true,   
        minLength : 6,
    },
    firstName:{
        type : String,
        required : true,
        trim :true,
        maxLength : 50
    },
    lastName: {
        type : string,
        required : true,
        trim : true,
        maxLength : 50
    }
})

const User = mongoose.model('User', UserSchema)

module.exports = {
    User
}


