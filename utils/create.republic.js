const Republic = require('../models/republic.model')

async function createRepublic(){
    const republic = await Republic.findOne({name : "Respublika"})
    if(!republic){
        const newRepublic = {
            name : "Respublika"
        }
        await Republic.create(newRepublic)
        return;
    }
    return;
}
module.exports = createRepublic