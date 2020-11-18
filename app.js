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
  req.session.destroy(err => {
    if (err) {
      console.log(err);
    } else {
      res.sendFile(path.join(__dirname, 'public', 'login.html'));
    }
  });
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

app.get('/category/:cate', (req, res) => {
  const cate = req.params.cate;

  const stores = db.get('stores').value();

  const cateStores = stores.filter(store => store.category === cate);

  res.send(cateStores);
});

app.get('/category', (req, res) => {
  if (!req.session.currentLogin) return res.redirect('/login');

  res.sendFile(path.join(__dirname, 'public', 'category.html'));
});

app.get('/storeInfo/:id', (req, res) => {
  const storeId = req.params.id;
  const store = db.get('stores').find({ id: storeId }).value();
  const user = db
    .get('users')
    .find({ id: JSON.parse(req.session.currentLogin).userId })
    .value();

  userNicArr = [];
  let reviewUser;
  store.reviews.forEach(review => {
    reviewUser = db.get('users').find({ id: review.reviewUserId }).value();

    userNicArr.push(reviewUser.nickname);
  });

  res.send({ ...store, userFavorite: user.favorite, userNicArr });
});

app.get('/storeInfo', (req, res) => {
  if (!req.session.currentLogin) return res.redirect('/login');

  res.sendFile(path.join(__dirname, 'public', 'storeInfo.html'));
});

app.post('/dib', (req, res) => {
  let user = db
    .get('users')
    .find({ id: JSON.parse(req.session.currentLogin).userId })
    .value();

  const findStore = user.favorite.find(
    storeId => storeId === req.body.storeName
  );

  const favoriteArr = findStore
    ? user.favorite.filter(storeId => storeId !== req.body.storeName)
    : [...user.favorite, req.body.storeName];

  user = db
    .get('users')
    .find({ id: JSON.parse(req.session.currentLogin).userId })
    .assign({ favorite: favoriteArr })
    .write();

  res.send(favoriteArr);
});

app.post('/review/:id', (req, res) => {
  const storeId = req.params.id;
  const review = req.body;

  const newReview = {
    reviewStar: review.reviewStar,
    reviewTxt: review.reviewTxt,
    reviewDate: review.reviewDate,
    reviewUserId: JSON.parse(req.session.currentLogin).userId,
    reviewStoreId: storeId,
  };

  const store = db.get('stores').find({ id: storeId }).value();
  const newReviewArr = [newReview, ...store.reviews];

  console.log(newReviewArr[0].reviewStar);

  const storeStar = newReviewArr.reduce((pre, cur, i, arr) => {
    return i !== arr.length - 1
      ? pre + cur.reviewStar
      : (pre + cur.reviewStar) / arr.length;
  }, 0);

  db.get('stores')
    .find({ id: storeId })
    .assign({ reviews: newReviewArr })
    .write();

  db.get('stores')
    .find({ id: storeId })
    .assign({ storeStar: storeStar.toFixed(1) })
    .write();

  res.send({ review: true });
});

app.get('/review', (req, res) => {
  if (!req.session.currentLogin) return res.redirect('/login');

  res.sendFile(path.join(__dirname, 'public', 'review.html'));
});

app.patch('/users', (req, res) => {
  const user = db
    .get('users')
    .find({ id: JSON.parse(req.session.currentLogin).userId })
    .value();

  const newData = req.body;

  if (newData.inputKind === 'pw') {
    db.get('stores')
      .find({ id: JSON.parse(req.session.currentLogin).userId })
      .assign({ pw: newData.pw })
      .write();
  } else {
    db.get('stores')
      .find({ id: JSON.parse(req.session.currentLogin).userId })
      .assign({ nickname: newData.nickname })
      .write();
  }

  res.send(true);
});

app.listen('8080', () => {
  console.log('Server is listening on http://localhost:8080');
});
