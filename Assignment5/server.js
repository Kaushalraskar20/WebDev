const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const session = require('express-session');

const app = express();

mongoose.connect('mongodb://127.0.0.1:27017/collegePortal')
.then(()=>console.log("MongoDB Connected"));

app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.use(express.static('public'));

app.use(session({ secret: 'secret', resave: false, saveUninitialized: true }));

const routes = require('./routes/routes');
app.use('/', routes);

app.listen(5000, ()=>console.log("Server running on http://localhost:5000"));
