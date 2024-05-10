const Province = require('../models/province.model')
const Republic = require('../models/republic.model')

async function createAndijon(){
    const province = await Province.findOne({name : "Andijon"})
    if(!province){
        const newProvince = await Province.create({
            name : "Andijon",
            password : "myPassword"
        })
        await Republic.findOneAndUpdate(
            { name: "Respublika" },
            { $push: { province: newProvince._id } },
            { new: true, upsert: true }
        );    
        return;
    } 
    return;
}
async function createBuxoro(){
    const province = await Province.findOne({name : "Buxoro"})
    if(!province){
        const newProvince = await Province.create({
            name : "Buxoro",
            password : "myPassword"
        })
        await Republic.findOneAndUpdate(
            { name: "Respublika" },
            { $push: { province: newProvince._id } },
            { new: true, upsert: true }
        );
        return;
    } 
    return;
}
async function createFargona(){
    const province = await Province.findOne({name : "Farg\'ona"})
    if(!province){
        const newProvince = await Province.create({
            name : "Farg'ona",
            password : "myPassword"
        })
        await Republic.findOneAndUpdate(
            { name: "Respublika" },
            { $push: { province: newProvince._id } },
            { new: true, upsert: true }
        );
        return;
    } 
    return;
}
async function createJizzax(){
    const province = await Province.findOne({name : "Jizzax"})
    if(!province){
        const newProvince = await Province.create({
            name : "Jizzax",
            password : "myPassword"
        })
        await Republic.findOneAndUpdate(
            { name: "Respublika" },
            { $push: { province: newProvince._id } },
            { new: true, upsert: true }
        );
        return;
    } 
    return;
}
async function createNamangan(){
    const province = await Province.findOne({name : "Namangan"})
    if(!province){
        const newProvince = await Province.create({
            name : "Namangan",
            password : "myPassword"
        })
        await Republic.findOneAndUpdate(
            { name: "Respublika" },
            { $push: { province: newProvince._id } },
            { new: true, upsert: true }
        );
        return;
    } 
    return;
}
async function createQashqadaryo(){
    const province = await Province.findOne({name : "Qashqadaryo"})
    if(!province){
        const newProvince = await Province.create({
            name : "Qashqadaryo",
            password : "myPassword"
        })
        await Republic.findOneAndUpdate(
            { name: "Respublika" },
            { $push: { province: newProvince._id } },
            { new: true, upsert: true }
        );
        return;
    } 
    return;
}
async function createSamarqand(){
    const province = await Province.findOne({name : "Samarqand"})
    if(!province){
        const newProvince = await Province.create({
            name : "Samarqand",
            password : "myPassword"
        })
        await Republic.findOneAndUpdate(
            { name: "Respublika" },
            { $push: { province: newProvince._id } },
            { new: true, upsert: true }
        );
        return;
    } 
    return;
}
async function createSirdaryo(){
    const province = await Province.findOne({name : "Sirdaryo"})
    if(!province){
        const newProvince = await Province.create({
            name : "Sirdaryo",
            password : "myPassword"
        })
        await Republic.findOneAndUpdate(
            { name: "Respublika" },
            { $push: { province: newProvince._id } },
            { new: true, upsert: true }
        );
        return;
    } 
    return;
}
async function createSurxondaryo(){
    const province = await Province.findOne({name : "Surxondaryo"})
    if(!province){
        const newProvince = await Province.create({
            name : "Surxondaryo",
            password : "myPassword"
        })
        await Republic.findOneAndUpdate(
            { name: "Respublika" },
            { $push: { province: newProvince._id } },
            { new: true, upsert: true }
        );
        return;
    } 
    return;
}
async function createToshkent(){
    const province = await Province.findOne({name : "Toshkent"})
    if(!province){
        const newProvince = await Province.create({
            name : "Toshkent",
            password : "myPassword"
        })
        await Republic.findOneAndUpdate(
            { name: "Respublika" },
            { $push: { province: newProvince._id } },
            { new: true, upsert: true }
        );
        return;
    } 
    return;
}
async function createXorazm(){
    const province = await Province.findOne({name : "Xorazm"})
    if(!province){
        const newProvince = await Province.create({
            name : "Xorazm",
            password : "myPassword"
        })
        await Republic.findOneAndUpdate(
            { name: "Respublika" },
            { $push: { province: newProvince._id } },
            { new: true, upsert: true }
        );
        return;
    } 
    return;
}
async function createNavoiy(){
    const province = await Province.findOne({name : "Navoiy"})
    if(!province){
        const newProvince = await Province.create({
            name : "Navoiy",
            password : "myPassword"
        })
        await Republic.findOneAndUpdate(
            { name: "Respublika" },
            { $push: { province: newProvince._id } },
            { new: true, upsert: true }
        );
        return;
    } 
    return;
}
module.exports = {
    createAndijon,
    createBuxoro,
    createFargona,
    createJizzax,
    createNamangan,
    createQashqadaryo,
    createSamarqand,
    createSirdaryo,
    createSurxondaryo,
    createToshkent,
    createXorazm,
    createNavoiy
}