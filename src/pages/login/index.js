import { useState } from 'react';
import { useRouter } from 'next/router';
import Input from '@/components/input/Input';
import Link from 'next/link';
import { LoginButton } from '@/components/button';
import { useModal } from '@/context/modalProvider';
import Modal from '@/components/modal/Modal';
import styles from './../signup/SignupPage.module.scss';
import useValidation from '@/hook/useValidation';
import { postAuthLogin } from '@/api/auth';

export default function LoginPage() {
  const router = useRouter();
  const { isOpen, openModal, closeModal } = useModal();
  const { handleValidate, inputError, errorMsg } = useValidation({
    email: true,
    password: true,
  });
  const [value, setValue] = useState({
    email: '',
    password: '',
  });
  const [apiError, setApiError] = useState('');
  const hasFormError = Object.values(inputError).every((el) => el !== true); // 전체 폼 에러확인

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValue((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!hasFormError) return null;

    try {
      const res = await postAuthLogin(value);
      router.push('/mydashboard');
    } catch (error) {
      setApiError(error.message);
      openModal('alertModal');
    }
  };

  return (
    <>
      <div className={styles.authWrap}>
        <h1 className={styles.logoWrap}>
          <Link href="/" className={styles.logo}>
            <span className="blind">Taskify</span>
          </Link>
          <span className={styles.massage}>오늘도 만나서 반가워요!</span>
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
            onBlur={handleValidate}
            hasError={inputError.email}
            error={errorMsg.email}
          />
          <Input
            label="비밀번호"
            type="password"
            id="password"
            name="password"
            placeholder="비밀번호를 입력해 주세요"
            value={value.password}
            onChange={handleChange}
            onBlur={handleValidate}
            hasError={inputError.password}
            error={errorMsg.password}
          />
          <div className={styles.btmBtn}>
            <LoginButton size="large" active={hasFormError ? true : false} onClick={handleLogin}>
              로그인
            </LoginButton>
          </div>
        </form>
        <div className={styles.linkArea}>
          <span>회원이 아니신가요?</span>
          <Link href="/signup">회원가입하기</Link>
        </div>
      </div>

      {/* 에러모달 */}
      <Modal
        variant="alert"
        id="alertModal"
        isOpen={isOpen('alertModal')}
        closeModal={closeModal}
        primaryBtn="확인"
      >
        {apiError}
      </Modal>
    </>
  );
}
LoginPage.headerType = 'none';
LoginPage.mainClassName = 'userPage';
