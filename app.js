const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const session = require('express-session');

const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const { fstat } = require('fs');
const adapter = new FileSync('db.json');
const db = low(adapter);
// Set some defaults (required if your JSON file is empty)
// db.defaults({ users: [], stores: [] }).write();

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser('pigProject'));
app.use(
  session({
    resave: false,
    saveUninitialized: false,
    secret: 'pigProject',
    cookie: {
      httpOnly: true,
      secure: false,
    },
  })
);

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  if (!req.session.currentLogin) return res.redirect('/login');

  res.sendFile(path.join(__dirname, 'public', 'main.html'));
});

app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

app.post('/login', (req, res) => {
  const loginInfo = req.body;

  const user = db
    .get('users')
    .find({ id: loginInfo.inputId, pw: loginInfo.inputPw })
    .value();

  if (!user) return res.send({ login: false });

  req.session.currentLogin = JSON.stringify({
    userId: user.id,
    userNickname: user.nickname,
  });

  res.send({ login: true });
});

app.get('/join', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'join.html'));
});

app.post('/join', (req, res) => {
  const joinInfo = req.body;

  const user = db.get('users').find({ id: joinInfo.inputId }).value();

  if (user) return res.send({ join: false });

  const newUser = {
    id: joinInfo.inputId,
    pw: joinInfo.inputPw,
    nickname: joinInfo.inputId,
    address: '',
    beforeAddress: [],
    favorite: [],
    orderList: [],
  };

  db.get('users').push(newUser).write();

  res.send({ join: true });
});

app.get('/address', (req, res) => {
  const user = db
    .get('users')
    .find({ id: JSON.parse(req.session.currentLogin).userId })
    .value();

  res.send(user.beforeAddress);
});

app.get('/todayfood', (req, res) => {
  if (!req.session.currentLogin) return res.redirect('/login');

  res.sendFile(path.join(__dirname, 'public', 'todayfood.html'));
});

app.delete('/address/:idx', (req, res) => {
  const idx = req.params.idx;

  let user = db
    .get('users')
    .find({ id: JSON.parse(req.session.currentLogin).userId })
    .value();

  const newBeforeAddress = user.beforeAddress.filter((_, i) => i !== +idx);

  user = db
    .get('users')
    .find({ id: JSON.parse(req.session.currentLogin).userId })
    .assign({ beforeAddress: newBeforeAddress })
    .write();

  res.send(user.beforeAddress);
});

app.listen('8080', () => {
  console.log('Server is listening on http://localhost:8080');
});
