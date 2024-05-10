const mongoose = require('mongoose');

const regionSchema = new mongoose.Schema({
    name: {
        type: String,
        required : true
    },
    type: {
        type: String,
        required : true,
    },
    parent: {
        type: mongoose.Schema.Types.ObjectId,
    }
}, {
    timestamps: true
});


module.exports = mongoose.model("Region", regionSchema);
