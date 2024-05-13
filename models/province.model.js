const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const provinceSchema = new mongoose.Schema({
    name: {
        type: String,
        required : true
    },
    password: {
        type: String,
        default : "myPassword",
        minLength: 6
    },
    passwordInfo : String,
    republic: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Republic'
    },
    folders: [{
        type : mongoose.Schema.Types.ObjectId,
        ref : "Folder"
    }],
    files: [{
        type :mongoose.Schema.Types.ObjectId,
        ref : "File"
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
},
    {timestamps: true}
);

// Parolni hashlash
provinceSchema.pre('save', async function(next) {
    if (!this.isModified('password')) {
        return next();
    }
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

// Parolni solishtirish
provinceSchema.methods.matchPassword = async function(parol) {
    return await bcrypt.compare(parol, this.password);
};

// JWT belgisini olish
provinceSchema.methods.jwtToken = function() {
    return jwt.sign({id: this._id, name: this.name}, process.env.JWT_TOKEN_SECRET, {
        expiresIn: process.env.JWT_EXPIRE
    });
};

module.exports = mongoose.model("Province", provinceSchema);
