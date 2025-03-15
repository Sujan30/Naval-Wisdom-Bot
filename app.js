const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const requestLimit = require('express-rate-limit');
const {
    allQuotes,
    randomQuote,
    idQuote
} = require('./query');
const index = require('./routes/index');

// limit is 20 requests within a minute
const limit = requestLimit({
      windowMs: 60 * 1000,
      max: 20, 
      message: "Arm yourself with specific knowledge, accountability, and leverage. Oh, and take breaks from requesting data from this API. - Naval Ravikant"
});

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(limit);

// Landing Pages
app.use('/', index);


// Routes
app.get('/all', (req, res) => {
  res.json(allQuotes());
});

app.get('/random', (req, res) => {
  res.json(randomQuote());
});

app.get('/:number', (req, res) => {
  res.json(idQuote(req.params.number));
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

app.listen(3005, process.env.IP, function(){
  console.log("Server running on port 3005");
});

const axios = require('axios');

const getRandomQuote = async () => {
  try {
    const response = await axios.get('http://localhost:3005/random'); // Ensure your server is running
    return response.data.quote; // Adjust based on your API response
  } catch (error) {
    console.error('Error fetching quote:', error);
    return null;
  }
};

module.exports = { app, getRandomQuote };

