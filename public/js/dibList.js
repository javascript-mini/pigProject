
// state
let dibStore = [];
let test = [
  {
    id: "1",
    category: "fastfood",
    storeName: "명랑핫도그 성수카페거리점",
    storeImg: "명랑핫도그.jpeg",
    minPrice: 3000,
    deliveryTime: 30,
    deliveryTip: 2000,
    storeStar: "3.3",
    tel: "031-962-6607",
    menu: [
      {
        foodName: "치즈폭탄 세트",
        foodPrice: 12300,
        foodImage: "명랑핫도그-치즈폭탄세트.jpg"
      },
      {
        foodName: "따따블 치즈 핫도그",
        foodPrice: 2700,
        foodImage: "명랑핫도그-따따블치즈핫도그.jpg"
      },
      {
        foodName: "감자 통 모짜 핫도그",
        foodPrice: 2500,
        foodImage: "명랑핫도그-감자통모짜핫도그.jpg"
      }
    ],
    reviews: [
      {
        reviewStar: 5,
        reviewTxt: "ddddffffff",
        reviewDate: "2020-11-19",
        reviewUserId: "test12",
        reviewStoreId: "1"
      }
    ]
  }
];


// DOM
const $storeList = document.querySelector('.store-list');

const render = async () => {
  // const res = await request.get(`/dib`);
  // store = await res.json();
  let html = '';
  test.forEach(store => {
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
}