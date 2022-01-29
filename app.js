require('dotenv').config();
const cors = require('cors');

const username = process.env.MONGO_USER_NAME;
const password = process.env.MONGO_PASSWORD;

const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const errorController = require('./controllers/error');
const User = require('./models/user');

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
  User.findById('61f4db462760174d2486bca0')
    .then(user => {
      req.user = user;
      next();
    })
    .catch(err => console.log(err));
});

app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);

const corsOptions = {
  origin: "https://byui-chris-cse341.herokuapp.com/",
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));

const options = {
  family: 4
};

const MONGODB_URL = process.env.MONGODB_URL || `mongodb+srv://${username}:${password}@cluster0.1agtp.mongodb.net/shop?retryWrites=true&w=majority`;

const PORT = process.env.PORT || 3000;

mongoose
  .connect(
    MONGODB_URL, options
  )
  .then(result => {
    User.findOne().then(user => {
      if (!user) {
        const user = new User({
          name: 'Chris',
          email: 'asdf@asdf.com',
          cart: {
            items: []
          }
        });
        user.save();
      }
    });
    app.listen(PORT);
  })
  .catch(err => {
    console.log(err);
  });
