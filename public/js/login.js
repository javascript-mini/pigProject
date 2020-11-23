// Doms
const $inputId = document.getElementById('userId');
const $inputPw = document.getElementById('userPw');
const $loginForm = document.querySelector('.login-form');
const $failIdMsg = document.querySelector('.fail-id-msg');
const $failPwMsg = document.querySelector('.fail-pw-msg');

$loginForm.onsubmit = async e => {
  e.preventDefault();

  let check = true;

  const idReg = /^[a-zA-Z0-9]{5,11}$/;
  const pwReg = /^[a-zA-Z0-9]{5,15}$/;

  $failIdMsg.textContent = '';
  $failPwMsg.textContent = '';

  if (!$inputId.value.trim()) {
    $failIdMsg.textContent = '아이디를 입력해주세요.';
    check = false;
    return;
  } else if (!idReg.test($inputId.value)) {
    $failIdMsg.textContent = '아이디는 5~11자 이내여야 합니다.';
    check = false;
    return;
  }

  if (!$inputPw.value.trim()) {
    $inputPw.focus();
    $failPwMsg.textContent = '비밀번호를 입력해주세요.';
    check = false;
  } else if (!pwReg.test($inputPw.value)) {
    $failPwMsg.textContent = '숫자와 영문자로 5~15자리 이내여야 합니다.';
    check = false;
  }

  if (check) {
    const inputValue = {
      inputId: $inputId.value,
      inputPw: $inputPw.value,
    };
    const res = await request.post('/login', inputValue);
    const loginCheck = await res.json();
    if (!loginCheck.login) {
      $failPwMsg.textContent = '존재하지 않는 회원입니다.';
    } else {
      location.assign('/');
    }
  }
};

window.onload = () => {
  sessionStorage.clear();
  $inputId.focus();
};
