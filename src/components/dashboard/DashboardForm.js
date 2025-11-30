'use client';

import React from 'react';
import Color from '@/components/common/Color';

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
        <div style={{ marginBottom: 6 }}>대시보드 이름</div>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="대시보드 이름을 입력하세요"
          style={{
            padding: '8px 10px',
            borderRadius: 6,
            border: '1px solid #ddd',
            width: '100%',
          }}
        />
      </label>

      {/* 색상 선택 */}
      <div>
        <div style={{ marginBottom: 6 }}>색상 선택</div>

        {/* 색상칩 리스트 */}
        <div style={{ display: 'flex', gap: 12 }}>
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
