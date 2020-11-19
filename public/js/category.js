const $storeList = document.getElementById('storeList');
const $prevBtn = document.getElementById('prevBtn');

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

const cateTitle = decodeURI(getUrlParams().cate);

const setTitle = () => {
  const $cateTitle = document.getElementById('cateTitle');
  let title = '';

  if (cateTitle === 'fastfood') {
    title = '패스트푸드';
  } else if (cateTitle === 'desirt') {
    title = '디저트';
  } else if (cateTitle === 'chicken') {
    title = '치킨';
  } else if (cateTitle === 'pizza') {
    title = '피자';
  } else if (cateTitle === 'bunsic') {
    title = '분식';
  } else if (cateTitle === 'anhu') {
    title = '안주';
  } else if (cateTitle === 'hansic') {
    title = '한식';
  } else if (cateTitle === 'jungsic') {
    title = '중식';
  } else if (cateTitle === 'ilsic') {
    title = '일식';
  }

  $cateTitle.textContent = title;
};

const renderStores = async () => {
  const res = await request.get(`/category/${cateTitle}`);
  const stores = await res.json();

  let html = '';
  stores.forEach(store => {
    html += `
    <li class="store-item">
      <a href="/storeInfo?id=${store.id}">
        <img src="img/${store.storeImg}" alt="${store.storeName}" class="store-img" />
        <div class="store-description">
          <p class="store-name">${store.storeName}</p>
          <p><i class="fas fa-star"></i>${store.storeStar} (${store.reviews.length})</p>
          <p><i class="far fa-clock"></i>${store.deliveryTime} / 최소주문 ${store.minPrice}원</p>
          <p>배달팁 ${store.deliveryTip}</p>
        </div>
      </a>
    </li>
    `;
  });
  $storeList.innerHTML = html;
};

window.onload = () => {
  setTitle();
  renderStores();
};

$prevBtn.onclick = () => {
  location.replace('/');
};
