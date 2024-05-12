const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const republicSchema = new mongoose.Schema({
    name: {
        type: String,
        required : true
    },
    password: {
        type: String,
        default : "myPassword",
        minLength: 6
    },
    province: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Province'
    }],
    folders: [{
        type : mongoose.Schema.Types.ObjectId,
        ref : "Folder"
    }],
    files : [{
        type :mongoose.Schema.Types.ObjectId,
        ref : "Folder"
    }],
    positions : [{
        type :mongoose.Schema.Types.ObjectId,
        ref : "Position"
    }],
    ranks : [{
        type :mongoose.Schema.Types.ObjectId,
        ref : "Rank"
    }],
    regions : [{
        type :mongoose.Schema.Types.ObjectId,
        ref : "Region"
    }],
    workers : [{
        type :mongoose.Schema.Types.ObjectId,
        ref : "Worker"
    }],
    privileges : [{
        type : mongoose.Schema.Types.ObjectId,
        ref : "Privilege"
    }]
}, {
    timestamps: true
});

// Parolni hashlash
republicSchema.pre('save', async function(next) {
    if (!this.isModified('password')) { // Faqatgina "password" maydoni o'zgartirilganda
        return next();
    }
    const salt = 10;
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

// Parolni solishtirish
republicSchema.methods.matchPassword = async function(parol) {
    return await bcrypt.compare(parol, this.password);
};

// JWT belgisini olish
republicSchema.methods.jwtToken = function() {
    return jwt.sign({id: this._id, name: this.name}, process.env.JWT_TOKEN_SECRET, {
        expiresIn: process.env.JWT_EXPIRE
    });
};

module.exports = mongoose.model("Republic", republicSchema);
