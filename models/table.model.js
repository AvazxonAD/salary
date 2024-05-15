const mongoose = require('mongoose')

const tableSchema = new mongoose.Schema({
    FIO : {type : String, required : true},
    summa : Number,
    date : {
        type : String,
        required : true
    },
    parent : {
        type : mongoose.Schema.Types.ObjectId
    }
})

module.exports = mongoose.model("Table", tableSchema)