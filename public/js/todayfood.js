// state
let foodList = [
  '얼큰한 짬뽕',
  '지글지글 삼겹살',
  '햄버거',
  '달달한 디저트',
  '치킨',
  '매콤한 떡볶이',
  '피자',
  '맛있는 짜장면',
  '핫도그',
  '영서',
];
// DOM
const $todayFoodWrap = document.querySelector('.today-food-wrap');
const $foodList = document.querySelector('.food-list');
const render = () => {
  let html = '';
  foodList = foodList.reduce(
    (a, v) => a.splice(Math.floor(Math.random(8) * a.length), 0, v) && a,
    []
  );
  foodList.forEach(food => {
    html += `<li>${food}</li>`;
  });
  $foodList.innerHTML = html;
};
window.onload = () => {
  render();
};
// Event
$todayFoodWrap.onclick = () => {
  $foodList.style.transform = 'translateY(-90%)';
  $foodList.style.transition = '0.5s ease-in-out';
  setTimeout(() => {
    $foodList.style.transform = 'translateY(0%)';
    $foodList.style.transition = '0.1s ease-in-out';
  }, 300);
  render();
};
