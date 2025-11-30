import { useState } from 'react';
import Modal from './Modal';
import Input from '@/components/input/Input';

/**
 * 컬럼 관리 모달
 * - 컬럼 이름 수정
 * - 컬럼 삭제 (확인 경고창)
 */
export default function ColumnManageModal({
  isOpen,
  closeModal,
  columnData,
  existingColumns = [],
  onUpdate,
  onDelete,
}) {
  const [columnName, setColumnName] = useState('');
  const [initializedColumnId, setInitializedColumnId] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [hasError, setHasError] = useState(false);

  // 모달이 열릴 때 컬럼 이름 초기화 (컬럼 ID가 변경될 때만)
  if (isOpen && columnData && columnData.id !== initializedColumnId) {
    setColumnName(columnData.title || '');
    setInitializedColumnId(columnData.id);
    setErrorMsg('');
    setHasError(false);
  }

  // 컬럼 이름 수정
  const handleUpdate = async () => {
    if (!columnName.trim()) {
      setErrorMsg('컬럼 이름을 입력해주세요.');
      setHasError(true);
      return;
    }

    if (columnName.trim() === columnData.title) {
      closeModal('columnManageModal');
      return;
    }

    const isDuplicate = existingColumns
      .filter((c) => c.id !== columnData.id)
      .some((c) => (c.title || '').trim() === columnName.trim());

    if (isDuplicate) {
      setErrorMsg('중복된 컬럼 이름입니다.');
      setHasError(true);
      return;
    }

    await onUpdate(columnData.id, columnName.trim());
  };

  // 삭제 버튼 클릭 - 확인 모달 표시
  const handleDeleteClick = () => {
    setShowDeleteConfirm(true);
  };

  // 삭제 확인
  const handleDeleteConfirm = async () => {
    closeModal('columnManageModal');
    setShowDeleteConfirm(false);
    await onDelete(columnData.id);
  };

  // 삭제 취소
  const handleDeleteCancel = () => {
    setShowDeleteConfirm(false);
  };

  return (
    <>
      <Modal
        id="columnManageModal"
        variant="default"
        title="컬럼 관리"
        isOpen={isOpen && !showDeleteConfirm}
        closeModal={closeModal}
        secondaryBtn="삭제"
        primaryBtn="변경"
        disabled={columnData && columnName.trim() === (columnData.title || '').trim()}
        onClick={handleUpdate}
        onSubClick={handleDeleteClick}
      >
        <div>
          <Input
            label="이름"
            type="text"
            id="columnName"
            placeholder="컬럼 이름을 입력해주세요"
            value={columnName}
            onChange={(e) => {
              setColumnName(e.target.value);
              if (hasError) {
                setHasError(false);
                setErrorMsg('');
              }
            }}
            required
            hasError={hasError}
            error={errorMsg}
          />
        </div>
      </Modal>

      {/* 삭제 확인 모달 */}
      <Modal
        id="columnDeleteConfirm"
        variant="confirm"
        isOpen={showDeleteConfirm}
        closeModal={handleDeleteCancel}
        secondaryBtn="취소"
        primaryBtn="삭제"
        onClick={handleDeleteConfirm}
        onSubClick={handleDeleteCancel}
      >
        컬럼의 모든 카드가 삭제됩니다.
      </Modal>

      {/* Alert 모달 제거: 인라인 에러로 대체 */}
    </>
  );
}
