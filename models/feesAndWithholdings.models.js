const mongoose = require('mongoose')

const feesAndWithholdingsSchema = new mongoose.Schema({
    FIO : {
        type : String,
        required : true
    },
    paymentsCount : {
        type : Number,
        required : true
    },
    deductsCount : {
        type : Number,
        required : true
    }
}, {timestamps : true})


module.exports = mongoose.model("FeesAndWithholdingsSchema", feesAndWithholdingsSchema)

