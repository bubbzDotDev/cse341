require('dotenv').config();
const cors = require('cors');

const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const csrf = require('csurf');
const flash = require('connect-flash');

const errorController = require('./controllers/error');
const User = require('./models/user');

const username = process.env.MONGO_USER_NAME;
const password = process.env.MONGO_PASSWORD;

const MONGODB_URL = process.env.MONGODB_URL || `mongodb+srv://${username}:${password}@cluster0.1agtp.mongodb.net/shop`;

const app = express();
const store = new MongoDBStore({
  uri: MONGODB_URL,
  collection: 'sessions'
});
const csrfProtection = csrf();

app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const authRoutes = require('./routes/auth');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({ 
  secret: 'my secret', 
  resave: false, 
  saveUninitialized: false,
  store: store
}));

app.use(csrfProtection);
app.use(flash());

app.use((req, res, next) => {
  if (!req.session.user) {
    return next();
  }
  User.findById(req.session.user._id)
  .then(user => {
    req.user = user;
    next();
  })
  .catch(err => console.log(err));
});

app.use((req, res, next) => {
  res.locals.isAuthenticated = req.session.isLoggedIn;
  res.locals.csrfToken = req.csrfToken();
  next();
})

app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);

app.use(errorController.get404);

const corsOptions = {
  origin: process.env.HEROKU_URL,
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));

const options = {
  family: 4,
  useNewUrlParser: true,
  useUnifiedTopology: true
};

const PORT = process.env.PORT || 3000;

mongoose
  .connect(
    MONGODB_URL, options
  )
  .then(result => {
    app.listen(PORT);
  })
  .catch(err => {
    console.log(err);
  });
