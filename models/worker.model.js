const mongoose = require('mongoose');

const workerSchema = new mongoose.Schema({
    FIOkril: {
        type: String,
        required : true
    },
    FIOlotin: {
        type: String,
        required : true,
    },
    inn : {
        type : Number,
        unique : true,
        required : true
    },
    inps : {
        type : Number,
        required : true
    },
    plastic : {
        type : Number,
        required : true
    },
    dateOfEmployment : {
        type : String,
        required : true
    },
    master: {
        type: mongoose.Schema.Types.ObjectId,
    }
}, {
    timestamps: true
});


module.exports = mongoose.model("Worker", workerSchema);