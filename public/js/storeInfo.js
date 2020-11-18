let store = {};
let user = {};

const $container = document.querySelector('.container');
const $prevBtn = document.getElementById('prevBtn');
const $storeInfoBox = document.querySelector('.store-info-box');
const $storePriceBox = document.querySelector('.store-price-box');
const $storeMain = document.querySelector('.store-main');
const $storeChangeBtn = document.querySelector('.store-change-btn');
const $orderBtn = document.querySelector('.order-btn');

let $telBtn;
let $dibBtn;
let $shareBtn;

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

const renderStore = async () => {
  const res = await request.get(`/storeInfo/${storeId}`);
  store = await res.json();

  $storeInfoBox.innerHTML = `
    <h1 class="store-name">${store.storeName}</h1>
    <p class="store-info"><i class="fas fa-star"></i>${
      store.storeStar
    } | 리뷰 ${store.reviews.length}</p>
    <div class="store-btn">
      <button id="telBtn"><i class="fas fa-phone-alt"></i>전화</button>
      <button id="dibBtn">
      ${
        store.userFavorite.find(storeId => +storeId === +store.id)
          ? '<i class="fas fa-heart dib"></i>'
          : '<i class="far fa-heart dib"></i>'
      }
      찜</button>
      <button class="shareBtn"><i class="fas fa-share-square"></i>공유</button>
    </div>
  `;

  const $telBtn = document.getElementById('telBtn');
  const $dibBtn = document.getElementById('dibBtn');

  $telBtn.onclick = () => {
    document.location.href = `tel:${store.tel}`;
  };

  $dibBtn.onclick = async e => {
    const res = await request.post('/dib', { storeName: store.id });
    store.userFavorite = await res.json();

    $dibBtn.innerHTML = `
      ${
        store.userFavorite.find(storeId => +storeId === +store.id)
          ? '<i class="fas fa-heart dib"></i>'
          : '<i class="far fa-heart dib"></i>'
      }
      찜
    `;
  };

  $storePriceBox.innerHTML = `
    <p><span>최소주문금액</span>${store.minPrice}원</p>
    <p><span>배달시간</span>${store.deliveryTime}분</p>
    <p><span>배달팁</span>${store.deliveryTip}원</p>
  `;

  let html = '';
  console.log(getUrlParams().review);
  if (!getUrlParams().review) {
    store.menu.forEach((li, idx) => {
      html += `
      <label for="${idx + 1}">
        <div class="menu-item">
          <input type="checkbox" id="${idx + 1}" value="${li.foodName}" />
          <div>
            <p class="menu-name">${li.foodName}</p>
            <p class="menu-price">${li.foodPrice}원</p>
          </div>
          <img src="img/${li.foodImage}" alt="${li.foodName}" />
        </div>
      </label>
      `;
    });
    $storeMain.innerHTML = html;
  } else {
    html = `
      <div class="review-title">
        <span><span><i class="fas fa-star"></i>${store.storeStar}</span><span>|</span><span>리뷰 ${store.reviews.length}개</span></span>
        <button id="reviewWriteBtn">리뷰쓰기</button>
      </div>
    `;

    store.reviews.forEach((review, i) => {
      html += `
      <div class="review-item">
        <p class="review-nick">${store.userNicArr[i]}</p>
        <p class="review-date">
          <span><i class="fas fa-star"></i>${review.reviewStar}</span>${review.reviewDate}
        </p>
        <p class="review-txt">
          ${review.reviewTxt}
        </p>
      </div>
      `;
    });
    $orderBtn.style.display = 'none';
    $storeMain.innerHTML = html;

    const $reviewWriteBtn = document.getElementById('reviewWriteBtn');
    const $menuBtn = document.getElementById('menuBtn');
    const $reviewBtn = document.getElementById('reviewBtn');

    $menuBtn.classList.remove('selected');
    $reviewBtn.classList.add('selected');

    $reviewWriteBtn.onclick = () => {
      location.assign(`/review?id=${store.id}`);
    };

    $container.scrollTo({ top: 430, left: 0, behavior: 'smooth' });
  }
};

window.onload = () => {
  renderStore();
};

$prevBtn.onclick = () => {
  location.replace(`/category?cate=${store.category}`);
};

$storeChangeBtn.onclick = e => {
  [...$storeChangeBtn.children].forEach(menu => {
    menu.classList.toggle('selected', menu.id === e.target.id);
  });

  let html = '';

  if (e.target.id == 'reviewBtn') {
    html = `
      <div class="review-title">
        <span><span><i class="fas fa-star"></i>${store.storeStar}</span><span>|</span><span>리뷰 ${store.reviews.length}개</span></span>
        <button id="reviewWriteBtn">리뷰쓰기</button>
      </div>
    `;

    store.reviews.forEach((review, i) => {
      html += `
      <div class="review-item">
        <p class="review-nick">${store.userNicArr[i]}</p>
        <p class="review-date">
          <span><i class="fas fa-star"></i>${review.reviewStar}</span>${review.reviewDate}
        </p>
        <p class="review-txt">
          ${review.reviewTxt}
        </p>
      </div>
      `;
    });
    $orderBtn.style.display = 'none';
    $storeMain.innerHTML = html;

    const $reviewWriteBtn = document.getElementById('reviewWriteBtn');

    $reviewWriteBtn.onclick = () => {
      location.assign(`/review?id=${store.id}`);
    };
  } else if (e.target.id == 'menuBtn') {
    store.menu.forEach((li, i) => {
      html += `
      <label for="${i + 1}">
        <div class="menu-item">
          <input type="checkbox" id="${i + 1}" value="${li.foodName}" />
          <div>
            <p class="menu-name">${li.foodName}</p>
            <p class="menu-price">${li.foodPrice}원</p>
          </div>
          <img src="img/${li.foodImage}" alt="${li.foodName}" />
        </div>
      </label>
      `;
    });
    $orderBtn.style.display = 'inline-block';
    $storeMain.innerHTML = html;
  }

  $container.scrollTo({ top: 430, left: 0, behavior: 'smooth' });
};
