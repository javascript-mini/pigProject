// Doms
const $inputReview = document.querySelector('.input-review');
const $numberOfLetters = document.querySelector('.number-of-letters');
const $inputLetters = document.querySelector('.input-letters');
const $prevBtn = document.querySelector('.prev-btn');
const $stars = document.querySelector('.stars');
const $failMsg = document.querySelector('.fail-msg');
const $btnReview = document.querySelector('.btn-review');

const today = new Date();
let star = 0;

const getUrlParams = () => {
  var params = {};
  window.location.search.replace(/[?&]+([^=&]+)=([^&]*)/gi, function (
    str,
    key,
    value
  ) {
    params[key] = value;
  });
  return params;
};

const storeId = decodeURI(getUrlParams().id);

$stars.onclick = e => {
  if (!e.target.matches('.star')) return;
  $failMsg.textContent = '';
  star = +e.target.id;

  [...$stars.children].forEach(_star => {
    if (+_star.id <= star) {
      _star.classList.add('full-star');
    } else {
      _star.classList.remove('full-star');
    }
  });
};

$inputReview.onfocus = () => {
  $failMsg.textContent = '';
};

$inputReview.onkeyup = e => {
  if (e.target.value.length > 49) {
    $inputLetters.textContent = '50';
    $numberOfLetters.style.color = 'red';
    return;
  }
  $numberOfLetters.style.color = 'black';
  $inputLetters.textContent = e.target.value.length;
};

$btnReview.onclick = async () => {
  let check = true;

  if (!star) {
    check = false;
    $failMsg.textContent = '별점과 리뷰입력은 필수입니다.';
    return;
  }

  if (!$inputReview.value) {
    check = false;
    $failMsg.textContent = '별점과 리뷰입력은 필수입니다.';
    return;
  }

  if (check) {
    await request.post(`/review/${storeId}`, {
      reviewStar: star,
      reviewTxt: $inputReview.value,
      reviewDate: `${today.getFullYear()}-${
        today.getMonth() + 1
      }-${today.getDate()}`,
    });

    location.assign(`/storeInfo?id=${storeId}&review=true`);
  }
};
$prevBtn.onclick = () => {
  window.history.back();
};