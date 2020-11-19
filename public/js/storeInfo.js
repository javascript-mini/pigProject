let store = {};
let user = {};

const $container = document.querySelector('.container');
const $prevBtn = document.getElementById('prevBtn');
const $cateTitle = document.getElementById('cateTitle');
const $storeInfoBox = document.querySelector('.store-info-box');
const $storePriceBox = document.querySelector('.store-price-box');
const $storeMain = document.querySelector('.store-main');
const $storeChangeBtn = document.querySelector('.store-change-btn');
const $orderBtn = document.querySelector('.order-btn');
let $checkInputs;

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

  $cateTitle.textContent = store.storeName;

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
  if (!getUrlParams().review) {
    store.menu.forEach((li, i) => {
      html += `
      <label for="${i + 1}">
        <div class="menu-item">
          <input type="checkbox" id="${i + 1}" class="check-input" value="${
        li.foodName
      }" />
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
    $checkInputs = document.querySelectorAll('.check-input');
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

    $container.scrollTo({ top: 435, left: 0, behavior: 'smooth' });
  }
};

window.onload = () => {
  renderStore();
};

$container.addEventListener('scroll', () => {
  if ($container.scrollTop > 10) {
    $cateTitle.style.visibility = 'visible';
  } else {
    $cateTitle.style.visibility = 'hidden';
  }
});

$prevBtn.onclick = () => {
  window.history.back();
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
          <input type="checkbox" id="${i + 1}" class="check-input" value="${
        li.foodName
      }" />
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

  $container.scrollTo({ top: 435, left: 0, behavior: 'smooth' });
};

$orderBtn.onclick = () => {
  const checkedInputs = [...$checkInputs].filter(
    checkInput => checkInput.checked === true
  );

  const menuNames = checkedInputs.map(
    input => input.nextElementSibling.firstElementChild.textContent
  );

  const oreder = [];

  store.menu.forEach(menuItem => {
    if (menuNames.indexOf(menuItem.foodName) === -1) return;

    const orderItem = {
      menuName: menuItem.foodName,
      menuPrice: menuItem.foodPrice,
      menuImg: menuItem.foodImage,
    };

    oreder.push(orderItem);
  });

  sessionStorage.setItem('sessionStoreName', store.storeName);
  sessionStorage.setItem('orderList', JSON.stringify(oreder));
  location.assign('/order');
};
