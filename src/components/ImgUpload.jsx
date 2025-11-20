import { use, useRef, useState } from 'react';

export default function ImgUpload({ label, id, setImg, img, style, update }) {
  const fileInputRef = useRef(null);
  const [isUpdate, setUIspdate] = useState('update');

  // 파일 선택창 열기
  const handleFile = () => {
    fileInputRef.current.click();
  };
  // 이미지 업로드
  async function handleImgUpload(e) {
    const file = e.target.files[0];
    if (!file) return;

    setUIspdate('');

    // const result = await PostImage(file);
    const result = URL.createObjectURL(file);
    setImg(result);
    if (fileInputRef.current) fileInputRef.current.value = '';
  }
  // 이미지 삭제
  const handleImgDelete = (e) => {
    e.preventDefault();
    setImg(null);
  };
  return (
    <div className="iptBox">
      {label && <div className="label">{label}</div>}
      <div className={`imgBox ${style || ''} ${update ? isUpdate : ''}`}>
        {img && <img src={img} alt="" />}
        {(!img || isUpdate) && (
          <>
            <button className="btnUpload" onClick={handleFile}>
              <span className="blind">이미지 등록</span>
            </button>
            <input type="file" onChange={handleImgUpload} ref={fileInputRef} />
          </>
        )}
      </div>
    </div>
  );
}
