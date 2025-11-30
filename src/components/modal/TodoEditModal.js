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

    const updatedData = {
      columnId: columnId,
      assigneeUserId: formData.assigneeUserId,
      title: formData.title,
      description: formData.description,
      dueDate: formData.dueDate.toISOString(),
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
          content={['To Do', 'On Progress', 'Done']}
          onChange={() => {}}
          initValue={'To Do'}
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
