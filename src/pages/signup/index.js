import { useState } from 'react';
import { useRouter } from 'next/router';
import Input from '@/components/input/Input';
import Link from 'next/link';
import { LoginButton } from '@/components/button';
import { useModal } from '@/context/modalProvider';
import Modal from '@/components/modal/Modal';
import useValidation from '@/hook/useValidation';
import styles from './SignupPage.module.scss';
import { postUsers } from '@/api/users';

export default function SignupPage() {
  const router = useRouter();
  const { isOpen, openModal, closeModal } = useModal();
  const { handleValidate, inputError, errorMsg } = useValidation({
    email: true,
    nickname: true,
    password: true,
    passwordRepeat: true,
  });
  const [value, setValue] = useState({
    email: '',
    nickname: '',
    password: '',
    passwordRepeat: '',
  });
  const [isChecked, setIsChecked] = useState(false);
  const [apiError, setApiError] = useState('');
  const hasFormError = Object.values(inputError).every((el) => el !== true) && isChecked; // 전체 폼 에러확인

  const handleCheckbox = (e) => {
    setIsChecked(e.target.checked);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValue((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSignupComplete = () => {
    router.push('/login');
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    if (!hasFormError) return null;
    const { passwordRepeat, ...rest } = value;
    try {
      const res = await postUsers(rest);
      openModal('signupComplete');
    } catch (error) {
      setApiError(error.message);
      openModal('signupError');
    }
  };

  return (
    <>
      <div className={styles.authWrap}>
        <h1 className={styles.logoWrap}>
          <Link href="/" className={styles.logo}>
            <span className="blind">Taskify</span>
          </Link>
          <span className={styles.massage}>첫 방문을 환영합니다!</span>
        </h1>
        <form className={styles.form}>
          <Input
            label="이메일"
            type="email"
            id="email"
            name="email"
            placeholder="이메일을 입력해 주세요"
            value={value.email}
            onChange={handleChange}
            onBlur={(e) => handleValidate(e, value)}
            hasError={inputError.email}
            error={errorMsg.email}
          />
          <Input
            label="닉네임"
            type="text"
            id="nickname"
            name="nickname"
            placeholder="닉네임을 입력해 주세요"
            value={value.nickname}
            onChange={handleChange}
            onBlur={(e) => handleValidate(e, value)}
            hasError={inputError.nickname}
            error={errorMsg.nickname}
          />
          <Input
            label="비밀번호"
            type="password"
            id="password"
            name="password"
            placeholder="8자 이상 입력해 주세요"
            value={value.password}
            onChange={handleChange}
            onBlur={(e) => handleValidate(e, value)}
            hasError={inputError.password}
            error={errorMsg.password}
          />
          <Input
            label="비밀번호 확인"
            type="password"
            id="passwordRepeat"
            name="passwordRepeat"
            placeholder="비밀번호를 한번 더 입력해 주세요"
            value={value.passwordRepeat}
            onChange={handleChange}
            onBlur={(e) => handleValidate(e, value)}
            hasError={inputError.passwordRepeat}
            error={errorMsg.passwordRepeat}
          />
          <div className={styles.checkbox}>
            <input type="checkbox" id="termsCheck" onChange={handleCheckbox} checked={isChecked} />
            <label htmlFor="termsCheck">이용약관에 동의합니다.</label>
          </div>
          <div className={styles.btmBtn}>
            <LoginButton size="large" active={hasFormError ? true : false} onClick={handleSignup}>
              가입하기
            </LoginButton>
          </div>
        </form>
        <div className={styles.linkArea}>
          <span>이미 회원이신가요?</span>
          <Link href="/login">로그인하기</Link>
        </div>
      </div>

      {/* 에러모달 */}
      <Modal
        variant="alert"
        id="signupError"
        isOpen={isOpen('signupError')}
        closeModal={closeModal}
        primaryBtn="확인"
      >
        {apiError}
      </Modal>

      {/* 가입완료모달 */}
      <Modal
        variant="alert"
        id="signupComplete"
        isOpen={isOpen('signupComplete')}
        closeModal={closeModal}
        primaryBtn="확인"
        onClick={handleSignupComplete}
      >
        가입이 완료되었습니다.
      </Modal>
    </>
  );
}
SignupPage.headerType = 'none';
