const express = require("express")
const colors = require("colors")
const connectDB = require('./config/db')
const errorHandler = require('./middlewares/errorHandler')
const cors = require("cors")
const createRepublic = require('./utils/create.republic')
const {
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
} = require('./utils/create.province')

const minimum = require('./utils/create.Minimum')
const dotenv = require('dotenv')
dotenv.config()

connectDB()


const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cors())

createRepublic()
createAndijon()
createBuxoro()
createFargona()
createJizzax()
createNamangan()
createQashqadaryo()
createSamarqand()
createSirdaryo()
createSurxondaryo()
createToshkent()
createXorazm()
createNavoiy()
minimum()

app.use('/auth', require("./router/auth.router"))
app.use('/position', require('./router/position.router'))
app.use('/rank', require('./router/rank.router'))
app.use('/region', require('./router/region.router'))
app.use('/worker', require('./router/worker.router'))
app.use('/minimum', require('./router/minimum.router'))
app.use('/republic', require('./router/republic.router'))
app.use('/province', require('./router/province.router'))
app.use('/folder', require('./router/folder.router'))
app.use('/file', require('./router/file.router'))
app.use('/privilege', require('./router/privilege.router'))
app.use('/table', require('./router/table.router'))

app.use(errorHandler)

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
    console.log(`server run on port : ${PORT}`.bgBlue)
}) 