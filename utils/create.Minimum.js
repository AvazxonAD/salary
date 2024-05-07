const Minimum = require('../models/minimumMonthly.model')

async function createMinimum(){
    const test = await Minimum.find()

    if(test.length === 0){
        await Minimum.create({
            summa : 100000
        })
        return;
    }
    return;
}

module.exports = createMinimum
