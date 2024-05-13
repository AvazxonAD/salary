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
    payments : {
            salary : {type : Number, default : 0},
            rank : {type : Number, default : 0},
            yearOfService : {type : Number, default : 0},
            apartmentPayment : {type : Number, default : 0},
            Fmc : {type : Number, default : 0},
            foodMoney : {type : Number, default : 0},
            wagesForHarm : {type : Number, default : 0},
            totalPayments : {type : Number, default : 0}
        },
    privilege : {
        type : Number,
        default : 0
    },
    deductionFromSalary : {
        sportsFund : {type : Number, default : 0},
        tradeUnion : {type : Number, default : 0},
        incomeTax : {type : Number, default : 0},
        alimony : {type : Number, default : 0},
        penalty : {type : Number, default : 0},
        totalDeduction : {type : Number, default : 0}
    },
    parent: {
        type: mongoose.Schema.Types.ObjectId,
    }
}, {
    timestamps: true
});


module.exports = mongoose.model("Worker", workerSchema);
