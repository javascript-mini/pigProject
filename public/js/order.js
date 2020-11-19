
// state
const storeNameFromServer = sessionStorage.getItem('sessionStoreName');
const orderDataFromServer = JSON.parse(sessionStorage.getItem('orderList'));
let orders = [];

// Doms
const $prevBtn = document.getElementById('prevBtn');
const $storeName = document.querySelector('.store-name');
const $orderLists = document.querySelector('.order-lists');
const $deleteAll = document.querySelector('.delete-all');
const $listCount = document.querySelector('.list-count');
const $orderPriceNodes = document.querySelectorAll('.order-price');

// Functions

// 총 주문 금액 계산
const sumPrice = function () {
  return [...$orderLists.children].reduce(
    (acc, list) =>
      acc +
      +list.firstElementChild.nextElementSibling.lastElementChild
        .firstElementChild.textContent,
    0
  );
};

// 총 주문 금액 요소에 표시
const renderSumPrice = () => {
  $orderPriceNodes.forEach(
    priceNode => (priceNode.textContent = `${sumPrice()} 원`)
  );
};

// 총 주문 개수 표시
const renderListCount = () => {
  const listConut = [...$orderLists.children].reduce(
    (acc, orderList) =>
      acc +
      +orderList.lastElementChild.firstElementChild.nextElementSibling
        .textContent,
    0
  );

  $listCount.textContent = listConut;
  renderSumPrice();
};

// counter의 증감버튼 클릭 시의 메뉴금액표시 변경 함수
const renderMenuPrice = target => {
  const $menuPrice =
    target.parentNode.previousElementSibling.previousElementSibling
      .lastElementChild.firstElementChild;
  let count;
  let accountPrice;
  if (target.previousElementSibling) {
    count = +target.previousElementSibling.textContent;
    accountPrice =
      +$menuPrice.textContent + $menuPrice.textContent / (count - 1);
    $menuPrice.textContent = accountPrice;
    console.log($menuPrice.textContent);
  } else {
    count = +target.nextElementSibling.textContent;
    accountPrice =
      +$menuPrice.textContent - $menuPrice.textContent / (count + 1);
    console.log(accountPrice);
    $menuPrice.textContent = accountPrice;
    console.log($menuPrice.textContent);
  }
};

// 주문메뉴 전체 삭제 후 렌더
const renderEmptyOrderList = () => {
  document.querySelector('main').innerHTML =
    '<div class="empty-order-list"></div><p class="empty-msg">선택된 메뉴가 없습니다.</p>';
  document.querySelector('.order-btn-wrap').style.display = 'none';
};

// orders에 기반한 order-list 렌더
const render = () => {
  let html = '';
  if (!orders.length) {
    renderEmptyOrderList();
    return;
  }
  orders.forEach(order => {
    html += `<li class="order-list">
    <div class="delete-btn"></div>
    <div class="menu-info">
      <p class="menu-name">${order.menuName}</p>
      <div class="menu-price-wrap"><p class="menu-price">${order.menuPrice}</p><span>원</span></div>
    </div>
    <img class="menu-img" src="./img/${order.menuImg}" alt="${order.menuName} 사진" />
    <div class="counter">
      <span class="minus-btn">-</span><span class="count">1</span><span class="plus-btn">+</span>
    </div>
  </li>`;
  });
  $orderLists.innerHTML = html;

  renderListCount();
};

// 서버에서 응답한 데이터 상태저장
const fetchOrders = () => {
  orders = orderDataFromServer;
  render();
};

$orderLists.onclick = e => {
  if (e.target.matches('.delete-btn')) {
    orders = orders.filter(
      order =>
        order.menuName !==
        e.target.nextElementSibling.firstElementChild.textContent
    );
    render();
  } else if (e.target.matches('.plus-btn')) {
    if (+e.target.previousElementSibling.textContent === 10) return;
    const count = e.target.previousElementSibling.textContent;
    e.target.previousElementSibling.textContent = +count + 1;
    renderMenuPrice(e.target);
    renderListCount();
  } else if (e.target.matches('.minus-btn')) {
    if (+e.target.nextElementSibling.textContent === 1) return;
    const count = e.target.nextElementSibling.textContent;
    e.target.nextElementSibling.textContent = +count - 1;
    renderMenuPrice(e.target);
    renderListCount();
  }
};

// add event handler
window.onload = () => {
  $storeName.textContent = storeNameFromServer;
  fetchOrders();
};
$deleteAll.onclick = () => {
  orders = [];
  renderEmptyOrderList();
};

// 뒤로가기
$prevBtn.onclick = () => {
  window.history.back();
};

document.querySelector('.order-btn').onclick = async () => {
  const orderMenu = [];
  const $menuNames = document.querySelectorAll('.menu-name');
  const $menuPrices = document.querySelectorAll('.menu-price');
  const $menuCounts = document.querySelectorAll('.count');
  const $totalPrice = document.getElementById('totalPrice');

  [...$menuNames].forEach((_, i) => {
    const menuItem = {
      menuName: $menuNames[i].textContent,
      menuOrderPrice: $menuPrices[i].textContent,
      menuCount: $menuCounts[i].textContent
    };
    orderMenu.push(menuItem);
  });

  sessionStorage.removeItem('orderList');
  sessionStorage.setItem('ordersData', JSON.stringify(orderMenu));
  sessionStorage.setItem('total', JSON.stringify([$listCount.textContent, $totalPrice.textContent.substring(0, $totalPrice.textContent.length - 2)]));

  const storeId = sessionStorage.getItem('sessionStoreId');
  const today = new Date();

  request.post('/orderList', {
    myStoreId: storeId,
    myStoreName: storeNameFromServer,
    myMenu: orderMenu,
    myPrice: $totalPrice.textContent.substring(0, $totalPrice.textContent.length - 2),
    myDate: `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`
  });

  location.assign('/completed');
};
