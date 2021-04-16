const express = require('express')
const router = require('./routes')
const errorHandler = require('./middlewares/errorHandler')
const app = express()
const PORT = process.env.PORT || 3000

app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(router)
app.use(errorHandler)

app.get('/', (req, res, next) => {
  res.send('test')
})

app.listen(PORT, () => console.log(`This app is running on http://localhost:${PORT}`))
