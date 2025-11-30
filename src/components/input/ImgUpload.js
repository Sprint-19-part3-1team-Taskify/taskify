import Image from 'next/image';
import { useRef, useState, forwardRef, useImperativeHandle } from 'react';
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
 * @param {Function} [props.setImg]
 *   - (deprecated) 이미지 URL을 설정하는 상태 업데이트 함수
 *
 * @param {Function} [props.onUpload]
 *   - 이미지 업로드 후 URL을 전달하는 콜백 (imageUrl: string) => void
 *
 * @param {string | null} [props.img]
 *   - 현재 표시될 이미지 URL 또는 null
 *
 * @param {string | null} [props.initialImage]
 *   - 초기 이미지 URL
 *
 * @param {string} [props.type]
 *   - 이미지 박스의 타입 클래스 (예: "user || card")
 *
 * @param {number} [props.columnId]
 *   - 카드 이미지 업로드 시 필요한 컬럼 ID
 *
 * @param {boolean} [props.update=false]
 *   - true: 이미지가 있어도 업로드 버튼 표시 (수정 모드)
 *   - false: 이미지가 없을 때만 업로드 버튼 표시 (신규 등록 모드)
 *
 * @returns {JSX.Element} ImgUpload Component
 *
 * @example
 * // 신규 이미지 등록 (새 방식)
 * <ImgUpload
 *   onUpload={handleImageUpload}
 *   label="이미지"
 *   type="card"
 *   columnId={columnId}
 * />
 */

const ImgUpload = forwardRef(function ImgUpload(
  { label, img, setImg, onUpload, type, columnId, initialImage, update },
  ref,
) {
  const fileInputRef = useRef(null);
  const [isUpdate, setUpdate] = useState('update');
  const [previewUrl, setPreviewUrl] = useState(initialImage || img || null);
  const [isUploading, setIsUploading] = useState(false);
  const selectedFileRef = useRef(null);

  // 파일 선택창 열기
  const handleFile = () => {
    fileInputRef.current.click();
  };

  // 파일 선택 시 로컬 미리보기 생성
  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // 로컬 미리보기 URL 생성
    const localUrl = URL.createObjectURL(file);
    setPreviewUrl(localUrl);
    setUpdate('');

    // 파일 객체 저장 (나중에 업로드용)
    selectedFileRef.current = file;
  };

  // 실제 업로드 함수 (외부에서 호출 가능)
  const uploadImage = async () => {
    const file = selectedFileRef.current;
    if (!file) return null;

    setIsUploading(true);
    try {
      let result = null;
      if (type === 'card' && columnId) {
        result = await postColumnsIdCardImage(columnId, file);
      } else if (type === 'user') {
        result = await postUsersMeImage(file);
      }

      if (result?.imageUrl) {
        // onUpload 우선, 없으면 setImg 사용 (호환)
        if (onUpload) {
          onUpload(result.imageUrl);
        } else if (setImg) {
          setImg(result.imageUrl);
        }
        setPreviewUrl(result.imageUrl);
        return result.imageUrl;
      }
      return null;
    } catch (error) {
      console.error('이미지 업로드 실패:', error);
      return null;
    } finally {
      setIsUploading(false);
    }
  };

  // ref를 통해 uploadImage 함수 노출
  useImperativeHandle(ref, () => ({
    uploadImage,
  }));
  return (
    <div className="iptBox">
      {label && <div className="label">{label}</div>}
      <div
        className={`imgBox ${type} ${update ? isUpdate : ''}`}
        onClick={handleFile}
        style={{ cursor: 'pointer' }}
      >
        {previewUrl?.trim() && (
          <Image
            src={previewUrl}
            alt="이미지 미리보기"
            fill
            style={{ objectFit: 'cover' }}
            unoptimized
          />
        )}
        {(!previewUrl || isUpdate) && (
          <>
            <button
              className="btnUpload"
              onClick={(e) => {
                e.stopPropagation();
                handleFile();
              }}
              disabled={isUploading}
              type="button"
            >
              <span className="blind">{isUploading ? '업로드 중...' : '이미지 등록'}</span>
            </button>
          </>
        )}
        <input
          type="file"
          onChange={handleFileSelect}
          accept="image/*"
          ref={fileInputRef}
          disabled={isUploading}
          style={{ display: 'none' }}
        />
      </div>
    </div>
  );
});

export default ImgUpload;
