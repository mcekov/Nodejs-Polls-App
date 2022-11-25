const mongoose = require('mongoose')

// Map global promises
mongoose.Promise = global.Promise

// Mongoose connect
let endPoint = '' //Add endpoint to connect to MLab
mongoose
  .connect(endPoint, { useNewUrlParser: true })
  .then(() => console.log('MongoDB Connected...'))
  .catch((err) => console.log(err))
