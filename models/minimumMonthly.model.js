const mongoose = require('mongoose');

const minimumSchema = new mongoose.Schema({
    summa : {
        type : Number,
        default :100000
    }
}, {
    timestamps: true
});


module.exports = mongoose.model("Minimum", minimumSchema);
