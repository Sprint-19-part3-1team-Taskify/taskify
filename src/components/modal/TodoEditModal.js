import { useState, useEffect } from 'react';
import Modal from './Modal';
import Input from '@/components/input/Input';
import InputTag from '@/components/input/InputTag';
import ImgUpload from '@/components/input/ImgUpload';
import Dropdown from '@/components/common/Dropdown';
import Textarea from '@/components/input/Textarea';

/**
 * 할 일 수정 모달
 * - /guide/modal 페이지의 할일 수정 모달 UI 참고하여 재작성
 * - 만들어진 카드 정보로 input이 기본값으로 채워짐
 * - 값이 하나라도 바뀌면 '수정' 버튼 활성화
 * - 날짜 입력은 DatePicker 사용
 */
export default function TodoEditModal({
  isOpen,
  closeModal,
  cardData,
  columnId,
  dashboardId,
  members,
  columns = [], // 컬럼 목록 추가
  onSuccess,
}) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    dueDate: null,
    assigneeUserId: null,
    tags: [],
    imageUrl: null,
    columnId: null, // 컬럼 ID 추가
  });

  const [originalData, setOriginalData] = useState(null);
  const [initializedCardId, setInitializedCardId] = useState(null);

  // 카드 데이터로 초기화 (카드 ID가 변경될 때만)
  if (cardData && isOpen && cardData.id !== initializedCardId) {
    const initialData = {
      title: cardData.title || '',
      description: cardData.description || '',
      dueDate: cardData.dueDate ? new Date(cardData.dueDate) : null,
      assigneeUserId: cardData.assignee?.userId || null,
      tags: cardData.tags || [],
      imageUrl: cardData.imageUrl || null,
      columnId: columnId || null, // 현재 컬럼 ID 저장
    };
    setFormData(initialData);
    setOriginalData(initialData);
    setInitializedCardId(cardData.id);
  }

  // 변경 감지
  const isChanged = originalData && JSON.stringify(formData) !== JSON.stringify(originalData);

  // 입력 변경 핸들러
  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // 담당자 선택 (이름 -> userId 매핑)
  const handleAssigneeChange = (selectedName) => {
    const found = members.find((m) => (m.nickname || m.email) === selectedName);
    if (found) setFormData((prev) => ({ ...prev, assigneeUserId: found.userId }));
  };

  // 태그 추가
  const handleAddTag = (newTag) => {
    if (newTag && !formData.tags.includes(newTag)) {
      setFormData((prev) => ({ ...prev, tags: [...prev.tags, newTag] }));
    }
  };

  // 태그 삭제
  const handleRemoveTag = (tagToRemove) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }));
  };

  // 이미지 업로드
  const handleImageUpload = (imageUrl) => {
    setFormData((prev) => ({ ...prev, imageUrl }));
  };

  // 할 일 수정
  const handleSubmit = async () => {
    if (!isChanged) return;

    // dueDate를 YYYY-MM-DD HH:MM 형식으로 변환
    const formatDueDate = (date) => {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');
      return `${year}-${month}-${day} ${hours}:${minutes}`;
    };

    const updatedData = {
      columnId: formData.columnId || columnId, // 변경된 컬럼 ID 사용
      assigneeUserId: formData.assigneeUserId,
      title: formData.title,
      description: formData.description,
      dueDate: formatDueDate(formData.dueDate),
      tags: formData.tags,
      imageUrl: formData.imageUrl || undefined,
    };

    await onSuccess(cardData.id, updatedData);
  };

  // 드롭다운용 멤버 이름 배열
  const memberNames = members.map((m) => m.nickname || m.email);

  // 현재 담당자 이름
  const currentAssigneeName = (() => {
    if (!formData.assigneeUserId) return '';
    const found = members.find((m) => m.userId === formData.assigneeUserId);
    return found ? found.nickname || found.email : '';
  })();

  // 컬럼 드롭다운용 컬럼 이름 배열
  const columnNames = columns.map((col) => col.title);

  // 현재 컬럼 이름
  const currentColumnName = (() => {
    const currentColId = formData.columnId || columnId;
    const found = columns.find((col) => col.id === currentColId);
    return found ? found.title : '';
  })();

  // 컬럼 변경 핸들러
  const handleColumnChange = (selectedColumnName) => {
    const found = columns.find((col) => col.title === selectedColumnName);
    if (found) setFormData((prev) => ({ ...prev, columnId: found.id }));
  };

  return (
    <Modal
      id="todoEditModal"
      variant="type1"
      title="할 일 수정"
      isOpen={isOpen}
      closeModal={closeModal}
      secondaryBtn="취소"
      primaryBtn="수정"
      onClick={handleSubmit}
      disabled={!isChanged}
    >
      {/* 상태 & 담당자 */}
      <div className="dropDownWrap">
        <Dropdown
          type="progress"
          label="상태"
          content={columnNames}
          onChange={handleColumnChange}
          initValue={currentColumnName}
        />
        <Dropdown
          type="member"
          label="담당자"
          content={memberNames}
          onChange={handleAssigneeChange}
          placeholder="담당자를 선택해주세요"
          initValue={currentAssigneeName}
        />
      </div>

      {/* 제목 */}
      <Input
        label="제목"
        type="text"
        id="todoTitle"
        name="title"
        placeholder="제목을 입력해주세요"
        value={formData.title}
        onChange={(e) => handleChange('title', e.target.value)}
        required
      />

      {/* 설명 */}
      <Textarea
        label="설명"
        id="todoDescription"
        name="description"
        value={formData.description}
        placeholder="설명을 입력해 주세요"
        onChange={(e) => handleChange('description', e.target.value)}
        required
      />

      {/* 마감일 */}
      <Input
        label="마감일"
        type="date"
        id="todoDueDate"
        name="dueDate"
        startDate={formData.dueDate}
        onChange={(date) => handleChange('dueDate', date)}
        required
      />

      {/* 태그 */}
      <InputTag
        tags={formData.tags}
        onAddTag={(tag) => setFormData((prev) => ({ ...prev, tags: [...prev.tags, tag] }))}
        onRemoveTag={(tag) =>
          setFormData((prev) => ({ ...prev, tags: prev.tags.filter((t) => t !== tag) }))
        }
      />

      {/* 이미지 업로드 */}
      <ImgUpload
        type="card"
        setImg={handleImageUpload}
        img={formData.imageUrl}
        label="이미지"
        update
      />
    </Modal>
  );
}
