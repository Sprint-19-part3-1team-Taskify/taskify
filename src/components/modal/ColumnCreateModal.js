import { useState } from 'react';
import Modal from './Modal';
import Input from '@/components/input/Input';

/**
 * 컬럼 추가 모달
 * - 이름 input이 없으면 '생성' 버튼 비활성화
 * - 컬럼 이름 중복 체크
 * - 최대 10개까지 생성 가능
 */
export default function ColumnCreateModal({
  isOpen,
  closeModal,
  dashboardId,
  existingColumns,
  onSuccess,
}) {
  const [columnName, setColumnName] = useState('');
  const [error, setError] = useState('');
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');

  // 컬럼 이름 변경 핸들러
  const handleNameChange = (e) => {
    setColumnName(e.target.value);
    setError('');
  };

  // 컬럼 생성
  const handleSubmit = async () => {
    if (!columnName.trim()) {
      setError('컬럼 이름을 입력해주세요.');
      return;
    }

    // 컬럼 개수 제한 체크 (최대 10개)
    if (existingColumns && existingColumns.length >= 10) {
      setAlertMessage('컬럼은 최대 10개까지 생성할 수 있습니다.');
      setAlertOpen(true);
      return;
    }

    // 중복 체크
    const isDuplicate = existingColumns?.some(
      (col) => col.title.toLowerCase() === columnName.trim().toLowerCase(),
    );

    if (isDuplicate) {
      setAlertMessage('중복된 컬럼 이름입니다');
      setAlertOpen(true);
      return;
    }

    const columnData = {
      title: columnName.trim(),
      dashboardId: dashboardId,
    };

    await onSuccess(columnData);

    // 폼 초기화
    setColumnName('');
    setError('');
  };

  return (
    <Modal
      id="columnCreateModal"
      variant="default"
      title="새 컬럼 생성"
      isOpen={isOpen}
      closeModal={closeModal}
      secondaryBtn="취소"
      primaryBtn="생성"
      onClick={handleSubmit}
      disabled={!columnName.trim()}
    >
      <div>
        <Input
          label="이름"
          type="text"
          id="columnName"
          placeholder="컬럼 이름을 입력해주세요"
          value={columnName}
          onChange={handleNameChange}
          error={error}
          required
        />
        {existingColumns && (
          <p style={{ marginTop: '10px', fontSize: '14px', color: '#787486' }}>
            현재 컬럼 수: {existingColumns.length} / 10
          </p>
        )}
      </div>
      {/* Alert 모달 */}
      <Modal
        id="columnCreateAlert"
        variant="alert"
        isOpen={alertOpen}
        closeModal={() => setAlertOpen(false)}
        primaryBtn="확인"
      >
        {alertMessage}
      </Modal>
    </Modal>
  );
}
