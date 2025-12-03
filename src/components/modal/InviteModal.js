import styles from './InviteModal.module.scss';

export default function InviteModal({ email, setEmail, error, loading, onSubmit, onClose }) {
  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <h2 className={styles.title}>초대하기</h2>

        <form
          className={styles.container}
          onSubmit={(e) => {
            e.preventDefault();
            onSubmit(); // Enter 키 제출 + 버튼 클릭 모두 작동
          }}
        >
          <label className={styles.label}>이메일 입력</label>
          <input
            type="email"
            className={styles.input}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="example@email.com"
            required
          />

          {error && <p className={styles.error}>{error}</p>}

          <div className={styles.buttonGroup}>
            <button type="submit" disabled={loading}>
              {loading ? '보내는 중...' : '초대하기'}
            </button>
            <button type="button" onClick={onClose}>
              취소
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
