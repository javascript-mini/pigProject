// Doms
const $joinForm = document.querySelector('.join-form');
const $inputId = document.getElementById('userId');
const $inputPw = document.getElementById('userPw');
const $inputPwCheck = document.getElementById('pwCheck');
const $inputNick = document.getElementById('userNick');
const $failIdMsg = document.querySelector('.fail-id-msg');
const $failPwMsg = document.querySelector('.fail-pw-msg');
const $failPwCheckMsg = document.querySelector('.fail-pw-check-msg');
const $failNickMsg = document.querySelector('.fail-nick-msg');
$joinForm.onsubmit = async e => {
  e.preventDefault();
  let check = true;
  const idReg = /^[A-Za-z0-9]{5,11}$/;
  const pwReg = /^[a-zA-Z0-9]{5,15}$/;
  const nicReg = /^[\wㄱ-ㅎㅏ-ㅣ가-힣]{2,20}$/;
  $failIdMsg.textContent = '';
  $failPwMsg.textContent = '';
  $failPwCheckMsg.textContent = '';
  $failNickMsg.textContent = '';
  if (!$inputId.value.trim()) {
    $failIdMsg.textContent = '필수 정보입니다.';
    check = false;
  } else if (!idReg.test($inputId.value)) {
    $failIdMsg.textContent = '5~11자의 영문 소문자, 숫자만 가능합니다.';
    check = false;
  }
  if (!$inputPw.value.trim()) {
    $failPwMsg.textContent = '필수 정보입니다.';
    check = false;
  } else if (!pwReg.test($inputPw.value)) {
    $failPwMsg.textContent = '5~15자의 영문, 숫자를 사용하세요.';
    check = false;
  }
  if (!$inputPwCheck.value.trim()) {
    $failPwCheckMsg.textContent = '필수 정보입니다.';
    check = false;
  } else if ($inputPw.value !== $inputPwCheck.value) {
    $failPwCheckMsg.textContent = '비밀번호가 일치하지 않습니다.';
    check = false;
  }
  if (!$inputNick.value.trim()) {
    $failNickMsg.textContent = '필수 정보입니다.';
    check = false;
  } else if (!nicReg.test($inputNick.value)) {
    $failNickMsg.textContent = '띄어쓰기와 특수문자를 제외한 2자 이상이어야 합니다.';
    check = false;
  }
  if (check) {
    const newUser = {
      inputId: $inputId.value,
      inputPw: $inputPw.value,
      inputNickname: $inputNick.value,
    };
    const res = await request.post('/join', newUser);
    const joinCheck = await res.json();
    if (!joinCheck.join) {
      $failIdMsg.textContent = '중복된 아이디입니다.';
    } else {
      location.assign('/login');
    }
  }
};
