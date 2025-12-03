import { useRef, useState, forwardRef, useImperativeHandle, useEffect } from 'react';
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
  const [imageError, setImageError] = useState(false);
  const [fileError, setFileError] = useState('');
  const selectedFileRef = useRef(null);

  const MAX_FILE_SIZE = 1 * 1024 * 1024; // 1MB
  const SUPPORTED_FORMATS = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];

  // 파일 선택창 열기
  const handleFile = () => {
    fileInputRef.current.click();
  };

  // 파일 선택 시 로컬 미리보기 생성
  const handleFileSelect = (e) => {
    const file = e.target.files[0];

    // 이전 blob URL 정리
    if (previewUrl && previewUrl.startsWith('blob:')) {
      URL.revokeObjectURL(previewUrl);
    }

    if (!file) {
      // 파일 선택 취소 시 초기 이미지로 복원
      setPreviewUrl(initialImage || img || null);
      selectedFileRef.current = null;
      setImageError(false);
      setFileError('');
      return;
    }

    // 파일 크기 검증
    if (file.size > MAX_FILE_SIZE) {
      setFileError('이미지는 최대 1MB까지 업로드 가능합니다.');
      setPreviewUrl(initialImage || img || null);
      selectedFileRef.current = null;
      // input 초기화
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      return;
    }

    // 파일 형식 검증
    if (!SUPPORTED_FORMATS.includes(file.type)) {
      setFileError('지원되는 이미지 형식: JPG, PNG, GIF, WEBP');
      setPreviewUrl(initialImage || img || null);
      selectedFileRef.current = null;
      // input 초기화
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      return;
    }

    // 검증 통과 시 미리보기 생성
    setFileError('');
    const localUrl = URL.createObjectURL(file);
    setPreviewUrl(localUrl);
    setUpdate('');
    setImageError(false); // 새 파일 선택 시 에러 상태 초기화

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
        setImageError(false); // 업로드 성공 시 에러 상태 초기화
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

  // initialImage나 img가 변경될 때 previewUrl 업데이트 및 에러 상태 초기화
  useEffect(() => {
    const newImageUrl = initialImage || img || null;
    // blob URL이 아닐 때만 외부에서 전달된 이미지로 업데이트
    if (newImageUrl && !previewUrl?.startsWith('blob:')) {
      if (newImageUrl !== previewUrl) {
        setPreviewUrl(newImageUrl);
        setImageError(false);
      }
    } else if (!newImageUrl && !previewUrl?.startsWith('blob:')) {
      setPreviewUrl(null);
      setImageError(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialImage, img]);

  // 컴포넌트 언마운트 시 blob URL 정리
  useEffect(() => {
    return () => {
      if (previewUrl && previewUrl.startsWith('blob:')) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  // ref를 통해 uploadImage 함수 노출
  useImperativeHandle(ref, () => ({
    uploadImage,
  }));
  return (
    <div className="iptBox">
      {label && <div className="label">{label}</div>}
      <div
        className="imageInfo"
        style={{ fontSize: '12px', color: '#787486', marginBottom: '8px' }}
      >
        이미지는 최대 1MB까지 업로드 가능합니다. (JPG, PNG, GIF, WEBP)
      </div>
      {fileError && (
        <div style={{ fontSize: '12px', color: '#d6173a', marginBottom: '8px' }}>{fileError}</div>
      )}
      <div
        className={`imgBox ${type} ${update ? isUpdate : ''}`}
        onClick={handleFile}
        style={{ cursor: 'pointer' }}
      >
        {previewUrl?.trim() && !imageError ? (
          <img
            src={previewUrl}
            alt="이미지 미리보기"
            style={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
            }}
            onError={() => setImageError(true)}
          />
        ) : previewUrl?.trim() && imageError ? (
          // 이미지 로드 실패 시 placeholder 표시
          <div
            style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: '#f1f1f5',
            }}
          >
            <svg
              width="40"
              height="40"
              viewBox="0 0 40 40"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              style={{ opacity: 0.5 }}
            >
              <path
                d="M20 13.3333C22.7614 13.3333 25 15.5719 25 18.3333C25 21.0948 22.7614 23.3333 20 23.3333C17.2386 23.3333 15 21.0948 15 18.3333C15 15.5719 17.2386 13.3333 20 13.3333Z"
                fill="#D9D9D9"
              />
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M6.66667 10C6.66667 8.15905 8.15905 6.66667 10 6.66667H30C31.841 6.66667 33.3333 8.15905 33.3333 10V30C33.3333 31.841 31.841 33.3333 30 33.3333H10C8.15905 33.3333 6.66667 31.841 6.66667 30V10ZM10 10H30V30H10V10Z"
                fill="#D9D9D9"
              />
            </svg>
          </div>
        ) : null}
        {(!previewUrl || isUpdate) && !imageError && (
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
        {imageError && (
          // 이미지 에러 시에도 업로드 버튼 표시 (placeholder 위에)
          <button
            className="btnUpload"
            onClick={(e) => {
              e.stopPropagation();
              handleFile();
            }}
            disabled={isUploading}
            type="button"
            style={{ zIndex: 1 }}
          >
            <span className="blind">{isUploading ? '업로드 중...' : '이미지 등록'}</span>
          </button>
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
