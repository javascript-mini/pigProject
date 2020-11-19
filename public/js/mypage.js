// state
let userInfo = {};

// DOM
const $userInfoChange = document.querySelector('.user-info-change');
const $userInfoList = document.querySelector('.user-info-list');
const $orderList = document.querySelector('.order-list');

const getUsers = async () => {
  const res = await request.get('/users');
  userInfo = await res.json();
  console.log(userInfo);
  render();
  orderRender();
};

// 최근 주소 그려줄 랜더 함수
const render = () => {
  $userInfoList.innerHTML = ` 
      <li>
      <span>아이디</span>
      <p>${userInfo.id}</p>
      </li>
      <li>
      <span>비밀번호</span>
      <input class="pw-input" type="text" placeholder="5 ~ 15자 이내로 입력하세요.">
      <button class="pw">변경</button>
      <span class="err-msg-pw"></span>
      </li>
      <li>
      <span>닉네임</span>
      <input class="name-input" type="text" placeholder="${userInfo.nickname}">
      <button class="name">변경</button>
      <span class="err-msg-name"></span>
      </li>
      <li class="user-info-log">
      <a class="logout" href="#">로그아웃</a>|<a class="leave" href="#">회원탈퇴</a>
      </li>`;

  const $pwInput = document.querySelector('.pw-input');
  const $nameInput = document.querySelector('.name-input');
  const $errMsgPw = document.querySelector('.err-msg-pw');
  const $errMsgName = document.querySelector('.err-msg-name');
  const $logout = document.querySelector('.logout');
  const $leave = document.querySelector('.leave');
  // 비밀번호, 닉네임 조건 안맞을 시 오류 메세지 출력 및
  $userInfoChange.onclick = async e => {
    if (e.target.matches('.user-info-change .pw')) {
      // console.log(e.target);
      let check = true;
      const pwReg = /^[a-zA-Z0-9]{5,15}$/;
      $errMsgPw.textContent = '';
      $errMsgName.textContent = '';
      console.log($pwInput.value);
      if (!$pwInput.value.trim()) {
        $errMsgPw.textContent = '필수 정보입니다.';
        check = false;
      } else if (!pwReg.test($pwInput.value)) {
        $errMsgPw.textContent = '5~15자 영문, 숫자를 사용하세요.';
        check = false;
      }
      if (check) {
        const res = await request.patch(`/users`, {
          inputKind: 'pw',
          pw: $pwInput.value,
        });

        location.assign('/login');
      }
      $pwInput.value = '';
    }
    if (e.target.matches('.user-info-change .name')) {
      let check = true;
      const nicReg = /^[\wㄱ-ㅎㅏ-ㅣ가-힣]{2,20}$/;
      $errMsgPw.textContent = '';
      $errMsgName.textContent = '';
      if (!$nameInput.value.trim()) {
        $errMsgName.textContent = '필수 정보입니다.';
        check = false;
      } else if (!nicReg.test($nameInput.value)) {
        $errMsgName.textContent = '띄어쓰기와 특수문자를 제외한 두 글자 이상.';
        check = false;
      }
      if (check) {
        const res = await request.patch('/users', {
          inputKind: 'nickname',
          nickname: $nameInput.value,
        });
        $nameInput.placeholder = $nameInput.value;
        $nameInput.value = '';
      }
    }
  };

  // 로그아웃
  $logout.onclick = () => {
    location.assign('/login');
  };

  // 회원 탈퇴
  $leave.onclick = async () => {
    const popup = document.querySelector('.popup');
    popup.style.display = 'flex';

    document.getElementById('yesBtn').onclick = async () => {
      await request.delete('/leave');
      location.assign('/login');
    };

    document.getElementById('noBtn').onclick = () => {
      popup.style.display = 'none';
    };
  };
};

const orderRender = () => {
  let html = '';
  console.log(userInfo.orderList);

  userInfo.orderList.forEach(list => {
    console.log(list.myMenu);
    html += `<li>
    <span>${list.myStoreName}</span>
    <span><span>${list.myMenu[0].menuName} ${
      list.myMenu.length - 1 ? `외 ${list.myMenu.length - 1}개` : ''
    } </span>
    ${list.myPrice}원</span>
    <a href="/storeInfo?id=${list.myStoreId}">가게보기</a>
  </li>`;
  });
  $orderList.innerHTML = html;
};

window.onload = () => {
  getUsers();
};
