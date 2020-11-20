// state
let addresses = [];
let index;
let isTransition = false;

// 슬라이드 영역

// DOM
const $ad = document.querySelector('.ad');
const $adItemContainer = document.querySelector('.ad-item-container');
const $adItems = document.querySelectorAll('.ad-item');
const $adItem = document.querySelector('.ad-item');

// 기본 셋팅
// 아이템의 이동 거리
let offset = 0;

// 슬라이드 시킬 아이템의 width, height, length 값 취득
const itemWidth = $adItem.offsetWidth;
// const itemHeight = $adItem.offsetHeight;
const itemsLength = $adItems.length;

// 첫번째, 마지막 노드 클론
const insertClone = () => {
  const firstItem = $adItems[0];
  const lastItem = $adItems[$adItems.length - 1];
  $adItemContainer.insertBefore(
    lastItem.cloneNode(true),
    $adItemContainer.firstChild
  );
  $adItemContainer.appendChild(firstItem.cloneNode(true));
};

// 아이템 컨테이너의 트렌스폼 속성 적용 및 움직인 위치에서 opacity 1
const itemContainerTransfom = () => {
  // isTransition = true;
  $adItemContainer.style.transform = `translate3D(${offset}px, 0, 0)`;
  $ad.style.opacity = '1';
};

// 클론된 노드 위치를 감안한 초기 컨테이너 위치
const boxPosition = () => {
  offset -= itemWidth;
  itemContainerTransfom();
};

// 아이템의 width값 만큼 컨테이너 이동
const movePrev = () => {
  offset += itemWidth;
  if (offset === 0) {
    setTimeout(() => {
      offset -= itemsLength * itemWidth;
      $adItemContainer.style.transition = 'none';
      $adItemContainer.style.transform = `translate3D(${offset}px, 0, 0)`;
    }, 1000);
  }
  itemContainerTransfom();
};

const moveNext = () => {
  offset -= itemWidth;
  console.log(offset);
  if (offset === -3096) {
    setTimeout(() => {
      $adItemContainer.style.transition = 'none';
      offset += itemsLength * itemWidth;
      $adItemContainer.style.transform = `translate3D(${offset}px, 0, 0)`;
    }, 1000);
  }
  itemContainerTransfom();
};

// Event
$ad.onclick = e => {
  if (isTransition) return;
  isTransition = true;
  $adItemContainer.style.transition = '1s ease-out';
  if (e.target.matches('.ad .prev')) {
    movePrev();
  } else if (e.target.matches('.ad .next')) {
    moveNext();
  }
  setTimeout(() => {
    isTransition = false;
  }, 1000);
};

const blockClick = () => {
  if (isTransition) return;
  isTransition = true;
  $adItemContainer.style.transition = '1s ease-out';
  moveNext();
  setTimeout(() => {
    isTransition = false;
  }, 1000);
};

const interver = () => {
  setInterval(() => {
    blockClick();
  }, 3000);
};

// 주소 영역
// DOM
const $address = document.querySelector('.address');
const $mapWrap = document.querySelector('.map-wrap');
const $prevBtn = document.querySelector('.prev-btn');
const $recentAddress = document.querySelector('#recentAddress');
const $recentAddressClass = document.querySelector('.recent-address');

// Event
// 주소창 클릭 이벤트
$address.onclick = () => {
  $mapWrap.style.transform = 'translate3D(0, -720px , 0)';
  $mapWrap.style.transition = '0.3s ease-out';
};

$prevBtn.onclick = () => {
  $mapWrap.style.transform = 'translate3D(0, 0, 0)';
  $mapWrap.style.transition = '0.3s ease-out';
};

// 최근 주소 그려줄 랜더 함수
const render = () => {
  let html = '';
  addresses.map(address => {
    html += `<li>
    <span>
      <span>${address}</span>
        <img src="./img/x.png" alt="">
    </span>
    </li>`;
  });
  $recentAddress.innerHTML = html;
};

// 서버에서 최근 주소 가져오기
const getAddres = async () => {
  const res = await request.get('/address');
  addresses = await res.json();
  render();
};
// X 버튼 클릭시 주소 삭제
const removeAddres = async () => {
  const res = await request.delete(`/address/${index}`);
  addresses = await res.json();
  render();
};

$recentAddressClass.onclick = e => {
  if (!e.target.matches('.recent-address img')) return;
  const add = e.target.parentNode.firstElementChild.textContent;
  index = addresses.findIndex(address => address === add);
  removeAddres();
};

window.onload = () => {
  insertClone();
  boxPosition();
  getAddres();
  interver();
};
