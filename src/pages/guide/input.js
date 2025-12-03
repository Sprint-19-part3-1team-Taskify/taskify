import { useState } from 'react';
import Input from '@/components/input/Input';
import Textarea from '@/components/input/Textarea';
import ImgUpload from '@/components/input/ImgUpload';
import InputTag from '@/components/input/InputTag';
import useValidation from '@/hook/useValidation';

export default function Inputs() {
  /* Input */
  const [tags, setTags] = useState([]); // 태그 생성

  const [value, setValue] = useState({
    email: '',
    title: '',
    password: '',
    passwordRepeat: '',
    date: null,
    detail: '',
    commnet: '',
  });
  const { handleValidate, inputError, errorMsg } = useValidation({
    email: true,
    password: true,
  });
  const handleChange = (e) => {
    const { name, value } = e.target;
    setValue((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  /* Input Search */
  const [search, setSearch] = useState('');

  /* Textarea */
  const handleTextSubmit = () => {};

  /* Image Upload */
  const [cardImg, setCardImg] = useState('');
  const [cardImg2, setCardImg2] = useState('/images/temp/image01.svg');
  const [useImg, setUserImg] = useState('');

  return (
    <>
      <h1>Input Examples</h1>
      {/* Input */}
      <Input
        label="이메일"
        type="email"
        id="email"
        name="email"
        placeholder="이메일을 입력해 주세요"
        onChange={handleChange}
        value={value.email}
      />
      <Input
        label="비밀번호"
        type="password"
        id="password"
        name="password"
        placeholder="비밀번호를 입력해 주세요"
        onChange={handleChange}
        value={value.password}
      />
      <Input
        label="비밀번호 확인"
        type="password"
        id="passwordRepeat"
        name="passwordRepeat"
        placeholder="비밀번호를 입력해 주세요"
        onChange={handleChange}
        value={value.passwordRepeat}
        onBlur={handleValidate}
        hasError={inputError.passwordRepeat}
        error={errorMsg.passwordRepeat}
      />
      <Input
        label="제목"
        type="text"
        id="title"
        name="title"
        placeholder="제목을 입력해주세요"
        onChange={handleChange}
        value={value.title}
        required
      />
      <Input
        label="마감일"
        type="date"
        id="date"
        name="date"
        startDate={value.date}
        onChange={(date) => setValue((prev) => ({ ...prev, date }))}
      />
      <Input
        type="search"
        id="search"
        name="search"
        placeholder="검색"
        onChange={(e) => setSearch(e.target.value)}
        value={search}
      />
      <InputTag tags={tags} setTags={setTags} />
      <br />
      <br />
      <h1>Textarea Examples</h1>
      {/* Textarea */}
      <Textarea
        label="댓글"
        id="commnet"
        name="commnet"
        value={value.commnet || ''}
        placeholder="댓글 작성하기"
        onChange={handleChange}
        onClick={handleTextSubmit}
      />
      <Textarea
        label="설명"
        id="detail"
        name="detail"
        value={value.detail || ''}
        placeholder="설명을 입력해 주세요"
        onChange={handleChange}
        required
      />
      <br />
      <br />
      <h1>Image Upload Examples</h1>
      {/* Image Upload */}
      <ImgUpload type="card" setImg={setCardImg} img={cardImg} label="이미지" />
      <ImgUpload type="card" setImg={setCardImg2} img={cardImg2} label="이미지" update />
      <ImgUpload type="user" setImg={setUserImg} img={useImg} update />
    </>
  );
}
