'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

import { useHeader } from '@/context/HeaderProvider';

// API
import { getDashboardsId } from '@/api/dashboards';
import { getMembers } from '@/api/members';

export default function DashboardDetail() {
  const router = useRouter();

  const id = router.query.id;
  const fixedId = Array.isArray(id) ? id[id.length - 1] : id;

  const { setHeaderConfig } = useHeader();

  const [loading, setLoading] = useState(true);
  const [dashboard, setDashboard] = useState(null);
  const [members, setMembers] = useState([]);

  /* ------------------------------------------
   * Header 설정
   ------------------------------------------ */
  useEffect(() => {
    if (!fixedId) return;
    if (!dashboard) return;

    setHeaderConfig({
      headerType: 'header4',
      dashboardName: dashboard?.title || '대시보드 상세',
      sidemenuShow: true,
      showCrown: false,
      dashboardId: fixedId,
    });
  }, [dashboard, fixedId, setHeaderConfig]);

  /* ------------------------------------------
   * Header padding
   ------------------------------------------ */
  useEffect(() => {
    const header = document.querySelector('header');
    if (header) header.style.paddingLeft = '300px';

    return () => {
      if (header) header.style.paddingLeft = '';
    };
  }, []);

  /* ------------------------------------------
   * 대시보드 상세 & 구성원 조회
   ------------------------------------------ */
  useEffect(() => {
    if (!router.isReady) return; // ⭐ 중요
    if (!fixedId) return;

    const fetchData = async () => {
      setLoading(true);

      // 1) 대시보드 상세 조회
      const res = await getDashboardsId(fixedId);

      if (res?.id) {
        setDashboard(res);
      } else {
        setDashboard(null);
      }

      // 2) 구성원 조회
      const membersRes = await getMembers({
        dashboardId: fixedId,
        page: 1,
        size: 20,
      });

      if (membersRes?.members) {
        setMembers(membersRes.members);
      }

      setLoading(false);
    };

    fetchData();
  }, [router.isReady, fixedId]);

  /* ------------------------------------------
   * 렌더링
   ------------------------------------------ */
  if (loading) return <>로딩중...</>;
  if (!dashboard) return <>대시보드를 찾을 수 없습니다.</>;

  return (
    <div style={{ padding: '40px 24px' }}>
      <h1 style={{ fontSize: 24, fontWeight: 600 }}>{dashboard.title}</h1>

      <h2 style={{ marginTop: 40, fontSize: 18 }}>구성원</h2>
      <ul>
        {members.map((m) => (
          <li key={m.id}>{m.name}</li>
        ))}
      </ul>
    </div>
  );
}
