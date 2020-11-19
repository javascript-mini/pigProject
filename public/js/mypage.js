// state
let userInfo = {};

// DOM
const $userRender = document.querySelector('.user-render');
const $userInfoChange = document.querySelector('.user-info-change');
const $userInfoList = document.querySelector('.user-info-list');
const $orderList = document.querySelector('.order-list');
const $pwInput = document.querySelector('.pw-input');
const $nameInput = document.querySelector('.name-input');
const $errMsgPw = document.querySelector('.err-msg-pw');
const $errMsgName = document.querySelector('.err-msg-name');
const $logout = document.querySelector('.logout');
const $leave = document.querySelector('.leave');

const getUsers = async () => {
  const res = await request.get('/users');
  userInfo = await res.json();
  render();
  orderRender();
};

// 최근 주소 그려줄 랜더 함수
const render = () => {
  $userInfoList.innerHTML = ` 
      <li><span>아이디</span><p>${userInfo.id}</p></li>
      <li><span>비밀번호</span><input type="text" placeholder="5 ~ 15자 이내로 입력하세요."><button>변경</button></li>
      <li><span>닉네임</span><input type="text" placeholder="${userInfo.nickname}"><button>변경</button></li>
      <li class="user-info-log"><a href="#">로그아웃</a>|<a href="#">회원탈퇴</a></li>`;
};

const orderRender = () => {
  let html = '';
  userInfo.orderList.forEach(list => {
    html += `<li>
    <span>${list.myStoreName}</span>
    <span>${list.myMenu.keys[0]} 외 ${list.myMenu.keys.length - 1} ${list.myPrice}원</span>
    <a href="/storeInfo?id=${list.myStoreId}">가게보기</a>
  </li>`;
  });
  $orderList.innerHTML = html;
};

// 비밀번호, 닉네임 조건 안맞을 시 오류 메세지 출력 및
// $userInfoChange.onclick = async e => {
//   if (e.target.matches('.user-info-change .pw')) {
//     // console.log(e.target);
//     let check = true;
//     const pwReg = /^[a-zA-Z0-9]{5,15}$/;
//     $errMsgPw.textContent = '';
//     console.log($pwInput.value);
//     if (!$pwInput.value.trim()) {
//       $errMsgPw.textContent = '필수 정보입니다.';
//       check = false;
//     } else if (!pwReg.test($pwInput.value)) {
//       $errMsgPw.textContent = '5~15자 영문, 숫자를 사용하세요.';
//       check = false;
//     }
//     if (check) {
//       const res = await request.patch(`/users`, {
//         inputKind: 'pw',
//         pw: $pwInput.value
//       });
//     }
//     $pwInput.value = '';
//   }
//   if (e.target.matches('.user-info-change .name')) {
//     // console.log(e.target);
//     const nicReg = /^[\wㄱ-ㅎㅏ-ㅣ가-힣]{2,20}$/;
//     $errMsgPw.textContent = '';
//     $errMsgName.textContent = '';
//     if (!$nameInput.value.trim()) {
//       $errMsgName.textContent = '필수 정보입니다.';
//       check = false;
//     } else if (!nicReg.test($nameInput.value)) {
//       $errMsgName.textContent = '띄어쓰기와 특수문자를 제외한 두 글자 이상.';
//       check = false;
//     }
//     if (check) {
//       const res = await request.patch('/users', {
//         inputKind: 'nickname',
//         nickname: $nameInput.value
//       });
//       $nameInput.value = '';
//     }
//   }
// };

// // 로그아웃
// $logout.onclick = async () => {
//   const res = await request.get('/login');
// };
// // 회원 탈퇴
// $leave.onclick = async () => {
//   let result = confirm('정말 탈퇴하시겠습니까?');
//   if (result) {
//     const res = await request.delete('/leave');
//   }
// };

window.onload = () => {
  getUsers();
  // render();
};