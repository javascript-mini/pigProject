// state
let dibStore = [];
let stores = [];

// DOM
const $storeList = document.querySelector('.store-list');

const render = async () => {
  const res = await request.get(`/dib`);
  stores = await res.json();
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
    </li>`;
  });
  $storeList.innerHTML = html;
};

window.onload = () => {
  render();
};
