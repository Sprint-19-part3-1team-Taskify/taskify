import { useState, useEffect, useRef } from 'react';
import Modal from './Modal';
import Input from '@/components/input/Input';
import InputTag from '@/components/input/InputTag';
import ImgUpload from '@/components/input/ImgUpload';
import Dropdown from '@/components/common/Dropdown';
import styles from './TodoModal.module.scss';

/**
 * 할 일 생성 모달
 * - 모든 input이 채워지면 '생성' 버튼 활성화
 * - 담당자는 드롭다운으로 초대받은 인원만 선택 가능
 * - 이미지는 최대 1개만 업로드 가능
 * - 태그 색상은 랜덤으로 선택
 * - 날짜 입력은 DatePicker 사용
 */
export default function TodoCreateModal({
  isOpen,
  closeModal,
  columnId,
  dashboardId,
  members,
  onSuccess,
}) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    dueDate: null,
    assigneeUserId: null,
    tags: [],
    imageUrl: null,
  });
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');

  // 폼 유효성 검사 (computed value)
  const isValid = !!(
    formData.title &&
    formData.description &&
    formData.dueDate &&
    formData.assigneeUserId
  );

  // 입력 변경 핸들러
  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // 담당자 선택 (이름 -> userId 매핑)
  const handleAssigneeChange = (selectedKey) => {
    if (!selectedKey) {
      setFormData((prev) => ({ ...prev, assigneeUserId: null }));
      return;
    }
    const found = members.find((m) => (m.nickname || m.email) === selectedKey);
    if (found) setFormData((prev) => ({ ...prev, assigneeUserId: found.userId }));
  };

  // 태그 추가
  const handleAddTag = (newTag) => {
    const tag = (newTag || '').trim();
    if (!tag) return;
    if (formData.tags.length >= 10) {
      setAlertMessage('태그는 최대 10개까지 입력 가능합니다.');
      setAlertOpen(true);
      return;
    }
    if (!formData.tags.includes(tag)) {
      setFormData((prev) => ({ ...prev, tags: [...prev.tags, tag] }));
    }
  };

  // 태그 삭제
  const handleRemoveTag = (tagToRemove) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }));
  };

  const imageUploadRef = useRef(null);

  // 모달이 닫힐 때 폼 초기화
  useEffect(() => {
    if (!isOpen) {
      setFormData({
        title: '',
        description: '',
        dueDate: null,
        assigneeUserId: null,
        tags: [],
        imageUrl: null,
      });
      // 이미지 업로드 컴포넌트도 초기화 (ref를 통해)
      if (imageUploadRef.current) {
        // ImgUpload 컴포넌트의 내부 상태는 컴포넌트가 언마운트되면 자동으로 초기화됨
      }
    }
  }, [isOpen]);

  // 할 일 생성
  const handleSubmit = async () => {
    if (!isValid) return;

    // columnId 검증
    const numericColumnId = Number(columnId);
    const numericDashboardId = Number(dashboardId);

    if (!numericColumnId || isNaN(numericColumnId)) {
      setAlertMessage('컬럼 정보가 올바르지 않습니다.');
      setAlertOpen(true);
      return;
    }

    // 이미지 업로드 처리 (파일이 선택된 경우에만)
    let uploadedImageUrl = formData.imageUrl;
    if (imageUploadRef.current?.uploadImage) {
      try {
        const result = await imageUploadRef.current.uploadImage();
        if (result) {
          uploadedImageUrl = result;
        }
      } catch (error) {
        console.error('이미지 업로드 실패:', error);
        setAlertMessage('이미지 업로드에 실패했습니다.');
        setAlertOpen(true);
        return;
      }
    }

    // dueDate를 YYYY-MM-DD HH:MM 형식으로 변환
    const formatDueDate = (date) => {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');
      return `${year}-${month}-${day} ${hours}:${minutes}`;
    };

    const cardData = {
      assigneeUserId: formData.assigneeUserId,
      dashboardId: numericDashboardId,
      columnId: numericColumnId,
      title: formData.title,
      description: formData.description,
      dueDate: formatDueDate(formData.dueDate),
      tags: formData.tags,
      imageUrl: uploadedImageUrl || undefined,
    };

    await onSuccess(cardData);

    // 폼 초기화
    setFormData({
      title: '',
      description: '',
      dueDate: null,
      assigneeUserId: null,
      tags: [],
      imageUrl: null,
    });
  };

  return (
    <Modal
      id="todoCreateModal"
      variant="type1"
      title="할 일 생성"
      isOpen={isOpen}
      closeModal={closeModal}
      secondaryBtn="취소"
      primaryBtn="생성"
      onClick={handleSubmit}
      disabled={!isValid}
    >
      <div className={styles.todoForm}>
        {/* 담당자 */}
        <div className="iptBox">
          <label className="required">담당자</label>
          <Dropdown
            type="member"
            label=""
            content={members}
            onChange={handleAssigneeChange}
            placeholder="담당자를 선택해주세요"
            initValue={null}
          />
        </div>

        {/* 제목 */}
        <Input
          label="제목"
          type="text"
          id="todoTitle"
          placeholder="제목을 입력해주세요"
          value={formData.title}
          onChange={(e) => handleChange('title', e.target.value)}
          required
        />

        {/* 설명 */}
        <div className="iptBox">
          <label htmlFor="todoDescription" className="required">
            설명
          </label>
          <textarea
            id="todoDescription"
            placeholder="설명을 입력해주세요"
            value={formData.description}
            onChange={(e) => handleChange('description', e.target.value)}
            rows={5}
          />
        </div>

        {/* 마감일 */}
        <Input
          label="마감일"
          type="date"
          id="todoDueDate"
          startDate={formData.dueDate}
          onChange={(date) => handleChange('dueDate', date)}
          required
        />

        {/* 태그 */}
        <InputTag
          label="태그"
          tags={formData.tags}
          onAddTag={handleAddTag}
          onRemoveTag={handleRemoveTag}
        />

        {/* 이미지 업로드 */}
        <ImgUpload label="이미지" type="card" columnId={columnId} ref={imageUploadRef} />
      </div>
      {/* Alert 모달 */}
      <Modal
        id="todoCreateAlert"
        variant="alert"
        isOpen={alertOpen}
        closeModal={() => setAlertOpen(false)}
        primaryBtn="확인"
        singleButton
      >
        {alertMessage}
      </Modal>
    </Modal>
  );
}
