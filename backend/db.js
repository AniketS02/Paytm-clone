const mongoose = require("mongoose")
mongoose.connect("your mongodb url")

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


