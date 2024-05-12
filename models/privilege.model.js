const mongoose = require('mongoose')

const privilegeSchema = new mongoose.Schema({
    name : {
        type : String,
        required : true
    },
    summa : {
        type : Number,
        required : true
    },
    parent : {
        type : mongoose.Schema.Types.ObjectId
    }

}, {timestamps : true}

)

module.exports = mongoose.model("Privilege", privilegeSchema)