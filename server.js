const express = require('express');
const mongoose = require('mongoose');

//const login = require('./routes/login');

const app = express();
app.use(express.json());
const db = require('./config/keys').mongoURI;
mongoose.connect(db)
    .then(() => console.log('MongoDB Connected...'))
    .catch(err => console.log(err));

// Use routes
//app.use('/login', login);

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server started on port ${port}`));

