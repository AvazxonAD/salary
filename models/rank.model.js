const mongoose = require('mongoose');

const rankSchema = new mongoose.Schema({
    name: {
        type: String,
        required : true
    },
    summa: {
        type: Number,
        required : true,
    },
    master: {
        type: mongoose.Schema.Types.ObjectId,
    }
}, {
    timestamps: true
});


module.exports = mongoose.model("Rank", rankSchema);
