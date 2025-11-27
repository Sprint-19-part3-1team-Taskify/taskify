import Image from 'next/image';
import { useRef, useState } from 'react';
import { postColumnsIdCardImage } from '@/api/columns';
import { postUsersMeImage } from '@/api/users';

/**
 * ImgUpload Component
 * 이미지 업로드 및 미리보기를 제공하는 컴포넌트
 *
 * @param {Object} props
 * @param {string} [props.label]
 *   - 이미지 업로드 영역 상단에 표시되는 레이블
 *
 * @param {Function} props.setImg
 *   - 이미지 URL을 설정하는 상태 업데이트 함수
 *
 * @param {string | null} props.img
 *   - 현재 표시될 이미지 URL 또는 null
 *
 * @param {string} [props.type]
 *   - 이미지 박스의 타입 클래스 (예: "user || card")
 *
 * @param {boolean} [props.update=false]
 *   - true: 이미지가 있어도 업로드 버튼 표시 (수정 모드)
 *   - false: 이미지가 없을 때만 업로드 버튼 표시 (신규 등록 모드)
 *
 * @returns {JSX.Element} ImgUpload Component
 *
 * @example
 * // 신규 이미지 등록
 * <ImgUpload
 *   setImg={setCardImg}
 *   img={img}
 *   label="이미지"
 * />
 */

export default function ImgUpload({ label, img, setImg, type, update }) {
  const fileInputRef = useRef(null);
  const [isUpdate, setUpdate] = useState('update');

  // 파일 선택창 열기
  const handleFile = () => {
    fileInputRef.current.click();
  };
  // 이미지 업로드
  async function handleImgUpload(e) {
    const file = e.target.files[0];
    if (!file) return;
    setUpdate('');

    if (type === 'card') {
      const result = await postColumnsIdCardImage(1, file);
      setImg(result);
    } else if (type === 'user') {
      const result = await postUsersMeImage(file);
      setImg(result);
    }

    if (fileInputRef.current) fileInputRef.current.value = '';
  }
  return (
    <div className="iptBox">
      {label && <div className="label">{label}</div>}
      <div className={`imgBox ${type} ${update ? isUpdate : ''}`}>
        {img?.trim() && <Image src={img} alt="" fill />}
        {(!img || isUpdate) && (
        <>
          <button className="btnUpload" onClick={handleFile}>
            <span className="blind">이미지 등록</span>
          </button>
          <input type="file" onChange={handleImgUpload} accept="image/*" ref={fileInputRef} />
        </>
        )}
        </div>
      </div>
    );
  }
