import { useState } from 'react';

const emailReg =
  /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/i;
export default function useValidation(initialError = {}) {
  const [errorMsg, setErrorMsg] = useState({});
  const [inputError, setInputError] = useState(initialError);

  const handleError = (name, value, massage = '') => {
    setInputError((prev) => ({
      ...prev,
      [name]: value,
    }));
    setErrorMsg((prev) => ({
      ...prev,
      [name]: massage,
    }));
  };

  const handleValidate = (e, values = {}) => {
    const name = e.target.name;
    const val = e.target.value.trim();

    switch (name) {
      case 'email':
        if (!emailReg.test(val)) {
          handleError('email', true, '이메일 형식으로 작성해 주세요.');
        } else {
          handleError('email', false, '');
        }
        break;
      case 'nickname':
        if (val.length > 10) {
          handleError('nickname', true, '열 자 이하로 작성해주세요.');
        } else {
          handleError('nickname', false, '');
        }
        break;
      case 'password':
        if (val.length < 8) {
          handleError('password', true, '비밀번호를 8자 이상 입력해주세요.');
        } else {
          handleError('password', true, '비밀번호를 8자 이상 입력해주세요.');
          handleError('password', false);
        }
        break;
      case 'passwordRepeat':
        if (val !== values.password) {
          handleError('passwordRepeat', true, '비밀번호가 일치하지 않습니다.');
        } else {
          handleError('passwordRepeat', false);
        }
        break;
    }
  };

  return {
    handleValidate,
    errorMsg,
    inputError,
  };
}
