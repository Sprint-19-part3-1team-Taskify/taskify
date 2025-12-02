import React from 'react';
import Color from '@/components/common/Color';

import styles from './DashboardForm.module.scss';

const COLOR_LIST = [
  { color: 'green', value: '#7ac555' },
  { color: 'purple', value: '#760dde' },
  { color: 'orange', value: '#ffa500' },
  { color: 'blue', value: '#76a5ea' },
  { color: 'pink', value: '#e876ea' },
];

export default function DashboardForm({ title, setTitle, color, setColor }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* 대시보드 이름 */}
      <label>
        <div className={styles.title}>대시보드 이름</div>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="대시보드 이름을 입력하세요"
          className={styles.input}
        />
      </label>

      {/* 색상 선택 */}
      <div>
        {/* 색상칩 리스트 */}
        <div className={styles.colorWrap}>
          {COLOR_LIST.map((c) => (
            <Color
              key={c.value}
              color={c.color}
              name="dashboard-color"
              value={c.value}
              selected={color}
              onChange={setColor}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
