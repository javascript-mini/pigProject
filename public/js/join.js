// state
let idCheck = true;
let pwCheck = true;
let pwckCheck = true;
let nickCheck = true;

// Doms
const $prevBtn = document.getElementById('prevBtn');
const $inputId = document.getElementById('userId');
const $inputPw = document.getElementById('userPw');
const $inputPwCheck = document.getElementById('pwCheck');
const $inputNick = document.getElementById('userNick');
const $failIdMsg = document.querySelector('.fail-id-msg');
const $failPwMsg = document.querySelector('.fail-pw-msg');
const $failPwCheckMsg = document.querySelector('.fail-pw-check-msg');
const $failNickMsg = document.querySelector('.fail-nick-msg');
const $btnJoin = document.querySelector('.btn-join');

// Reg
const idReg = /^[A-Za-z0-9]{5,11}$/;
const pwReg = /^[a-zA-Z0-9]{5,15}$/;
const nicReg = /^[\wㄱ-ㅎㅏ-ㅣ가-힣]{2,20}$/;

// add event handler

$inputId.onblur = async () => {
  idCheck = true;
  $failIdMsg.textContent = '';

  if (!$inputId.value.trim()) {
    $failIdMsg.textContent = '필수 정보입니다.';
    idCheck = false;
    return;
  }
  if (!idReg.test($inputId.value)) {
    $failIdMsg.textContent = '5~11자의 영문 소문자, 숫자만 가능합니다.';
    idCheck = false;
    return;
  }
  const res = await request.post('/checkId', { inputId: $inputId.value });
  const duplicateCheck = await res.json();
  if (!duplicateCheck.check) {
    $failIdMsg.textContent = '중복된 아이디입니다.';
    idCheck = false;
  }
  console.log(idCheck);
};

$inputPw.onblur = () => {
  pwCheck = true;
  $failPwMsg.textContent = '';

  if (!$inputPw.value.trim()) {
    $failPwMsg.textContent = '필수 정보입니다.';
    pwCheck = false;
    return;
  }
  if (!pwReg.test($inputPw.value)) {
    $failPwMsg.textContent = '5~15자의 영문, 숫자를 사용하세요.';
    pwCheck = false;
  }
  console.log(pwCheck);
};

$inputPwCheck.onblur = () => {
  pwckCheck = true;
  $failPwCheckMsg.textContent = '';

  if (!$inputPwCheck.value.trim()) {
    $failPwCheckMsg.textContent = '필수 정보입니다.';
    pwckCheck = false;
    return;
  }
  if ($inputPw.value !== $inputPwCheck.value) {
    $failPwCheckMsg.textContent = '비밀번호가 일치하지 않습니다.';
    pwckCheck = false;
  }
  console.log(pwckCheck);
};

$inputNick.onblur = () => {
  nickCheck = true;
  $failNickMsg.textContent = '';

  if (!$inputNick.value.trim()) {
    $failNickMsg.textContent = '필수 정보입니다.';
    nickCheck = false;
    return;
  }
  if (!nicReg.test($inputNick.value)) {
    $failNickMsg.textContent = '최소 두 자리 이상이어야 합니다.';
    nickCheck = false;
  }
  console.log(nickCheck);
};

window.onload = () => {
  sessionStorage.clear();
  $inputId.focus();
};

$btnJoin.onclick = async () => {
  if (idCheck && pwCheck && pwckCheck && nickCheck) {
    const newUser = {
      inputId: $inputId.value,
      inputPw: $inputPw.value,
      inputNickname: $inputNick.value,
    };
    await request.post('/join', newUser);
    location.assign('/login');
  }
};

$prevBtn.onclick = () => {
  location.replace('/');
};