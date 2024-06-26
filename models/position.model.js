const mongoose = require('mongoose');

const positionSchema = new mongoose.Schema({
    name: {
        type: String,
        required : true
    },
    percent: {
        type: Number,
        required : true,
    },
    salary : {
        type : Number,
        required : true
    },    
    parent : {
        type : mongoose.Schema.Types.ObjectId
    }
}, {
    timestamps: true
});


module.exports = mongoose.model("Position", positionSchema);
