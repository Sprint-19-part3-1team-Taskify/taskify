import { useState } from 'react';
import Input from '@/components/input/Input';
import Tag from '@/components/input/Tag';
import Textarea from '@/components/input/Textarea';
import ImgUpload from '@/components/input/ImgUpload';

export default function Forms() {
  /* Input */
  const [tags, setTags] = useState([]); // 태그 생성
  const [tagId, setTagId] = useState(0); // 태그 ID
  const [value, setValue] = useState({
    email: '',
    title: '',
    password: '',
    passwordRepeat: '',
    date: null,
    tag: '',
    detail: '',
    commnet: '',
  });
  const handleCreateTag = (e) => {
    if (e.key === 'Enter') {
      if (value.tag.trim()) {
        setTags((prev) => [
          { id: tagId, txt: value.tag, colorClass: `c${4 - (tags.length % 4)}` },
          ...prev,
        ]);
        setValue((prev) => ({ ...prev, tag: '' }));
        setTagId((prev) => prev + 1);
      }
    }
  };
  const handleDeleteTag = (e, value) => {
    setTags((prev) =>
      prev.filter((el) => {
        return el !== value;
      }),
    );
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    setValue((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  };

  /* Input Search */
  const [search, setSearch] = useState('');

  /* Textarea */
  const handleTextSubmit = () => {};

  /* Image Upload */
  const [img, setImg] = useState(null);
  const [img2, setImg2] = useState('/images/temp/image01.svg');
  const [img3, setImg3] = useState(null);

  return (
    <>
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
        error="8자 이상 입력해 주세요."
        onChange={handleChange}
        value={value.passwordRepeat}
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
        label="태그"
        type="text"
        id="tag"
        name="tag"
        placeholder="입력 후 Enter"
        value={value.tag}
        onChange={handleChange}
        onKeyDown={handleCreateTag}
      />
      {tags.length > 0 && (
        <div className="tagWrap">
          {tags.map((tg, index) => {
            return (
              <Tag key={tg.id} className={tg.colorClass} onClick={(e) => handleDeleteTag(e, tg)}>
                {tg.txt}
              </Tag>
            );
          })}
        </div>
      )}

      <br />

      <Input
        type="search"
        id="search"
        name="search"
        placeholder="검색"
        onChange={(e) => setSearch(e.target.value)}
        value={search}
      />

      <hr />

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

      <hr />

      {/* Image Upload */}
      <ImgUpload setImg={setImg} img={img} label="이미지" />
      <ImgUpload setImg={setImg2} img={img2} label="이미지" update />
      <ImgUpload setImg={setImg3} img={img3} style="lg" update />
    </>
  );
}
