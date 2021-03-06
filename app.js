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

const reviewRoutes = require('./routes/reviews'),
  carRoutes = require('./routes/cars'),
  indexRoutes = require('./routes/index'),
  userRoutes = require('./routes/users');

// APP CONFIG

mongoose.connect(
  process.env.DATABASEURL || 'mongodb://localhost/carros',
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  () => {
    console.log('DB connected');
  }
);

app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));
app.use('/public', express.static('public'));
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
app.use(userRoutes);
app.use('/cars', carRoutes);
app.use('/cars/:id/reviews', reviewRoutes);

app.listen(process.env.PORT || 5000, function () {
  console.log('SERVER IS RUNNING ON PORT 5000');
});
