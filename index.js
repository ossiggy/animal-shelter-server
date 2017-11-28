const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const {cats, dogs} = require('./data');

const {PORT, CLIENT_ORIGIN} = require('./config');
const {dbConnect} = require('./db-mongoose');
// const {dbConnect} = require('./db-knex');
const catArr = [];
const dogArr = [];

const app = express();

app.use(
    morgan(process.env.NODE_ENV === 'production' ? 'common' : 'dev', {
        skip: (req, res) => process.env.NODE_ENV === 'test'
    })
);

app.use(
    cors({
        origin: CLIENT_ORIGIN
    })
);

function populateArray(array, data) {
  // spread the data into an array
  // so we can iterate regardless of whether
  // the data is one animal or several animals.
  data = [...data];

  for (let i = 0; i < data.length; i++) {
    array.push(data[i]);
  }
}

app.get('/api/cat', (req, res) => {
  populateArray(catArr, cats)
  console.log(catArr)
  res.json(catArr[0]);
})

app.get('/api/dog', (req, res) => {
  populateArray(dogArr, dogs)
  res.json(dogArr[0]);
})

app.delete('/api/cat', (req,res) => {
  catArr.shift();
  res.sendStatus(200);
})

app.delete('/api/dog', (req,res) => {
  dogArr.shift();
  res.sendStatus(200);
})

function runServer(port = PORT) {
    const server = app
        .listen(port, () => {
            console.info(`App listening on port ${server.address().port}`);
        })
        .on('error', err => {
            console.error('Express failed to start');
            console.error(err);
        });
}

if (require.main === module) {
    dbConnect();
    runServer();
}

module.exports = {app};
