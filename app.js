const express = require('express'),
  methodOverride = require('method-override'),
  app = express(),
  bodyParser = require('body-parser'),
  mongoose = require('mongoose'),
  flash = require('connect-flash'),
  passport = require('passport'),
  LocalStrategy = require('passport-local'),
  User = require('./models/user');

// REQUIRING ROUTES

const commentRoutes = require('./routes/comments'),
  carRoutes = require('./routes/cars'),
  indexRoutes = require('./routes/index');

// APP CONFIG

mongoose.connect(
  process.env.MONGODB_URI, // || 'mongodb+srv://Vinicius:vini1306@cluster0-4gadr.mongodb.net/usedCarsApp?retryWrites=true&w=majority',
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  () => {
    console.log('DB connected');
  }
);
// mongoose.connect('mongodb://localhost/carros', {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// });
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));
app.use('/uploads', express.static('uploads'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(flash());

// PASSPORT CONFIGURATION

app.use(
  require('express-session')({
    secret: 'Secret test',
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.initialize());
app.use(passport.session());
passport.use(
  new LocalStrategy(
    {
      usernameField: 'email',
      passwordField: 'password',
    },
    User.authenticate()
  )
);
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function (req, res, next) {
  res.locals.currentUser = req.user;
  res.locals.error = req.flash('error');
  res.locals.success = req.flash('success');
  next();
});

app.use(indexRoutes);
app.use('/cars', carRoutes);
app.use('/cars/:id/comments', commentRoutes);

app.listen(process.env.PORT || 5000, function () {
  console.log('SERVER IS RUNNING ON PORT 5000');
});
