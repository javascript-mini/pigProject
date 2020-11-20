// server data
const storeName = sessionStorage.getItem('sessionStoreName');
const ordersData = JSON.parse(sessionStorage.getItem('ordersData'));
const total = JSON.parse(sessionStorage.getItem('total'));

// state
const today = new Date();

// doms
const $storeName = document.querySelector('.store-name');
const $orderSum = document.querySelector('.order-sum');
const $orderDate = document.querySelector('.order-date');
const $orderLists = document.querySelector('.order-lists');
const $orderPrice = document.querySelector('.order-price');

// functions
const renderOrderSum = () =>
  `${ordersData[0].menuName} 외 ${ordersData.length - 1}개`;

const renderOrderInfo = () => {
  $storeName.textContent = storeName;
  $orderSum.textContent = renderOrderSum();
  $orderDate.textContent = `주문일시: ${today.getFullYear()}년 ${
    today.getMonth() + 1
  }월 ${today.getDate()}일 ${today.getHours()}:${today.getMinutes()}`;
};

const renderOrderLists = () => {
  let html = '';
  ordersData.forEach(order => {
    html += `<li class="order-list">
    <p class="menu-name">${order.menuName}</p>
    <p class="count">${order.menuCount}개</p>
    <p class="menu-price">${(+order.menuOrderPrice).toLocaleString()} 원</p>
  </li>`;
  });

  $orderLists.innerHTML = html;
};

const renderOrderPrice = () => {
  $orderPrice.textContent = `${(+total[1]).toLocaleString()} 원`;
};

// add event handler

window.onload = () => {
  renderOrderInfo();
  renderOrderLists();
  renderOrderPrice();
};
