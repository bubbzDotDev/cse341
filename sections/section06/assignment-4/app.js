const express = require('express');
const bodyParser = require('body-parser');

const userData = require('./routes/home');
const userRoutes = require('./routes/users');

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(bodyParser.urlencoded({extended: false}));

app.use(userData.routes);
app.use(userRoutes);

app.listen(3000);
