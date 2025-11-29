'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

import { useHeader } from '@/context/HeaderProvider';
import { useAuth } from '@/context/authProvider';

// API
import { getDashboardsId } from '@/api/dashboards';
import { getMembers } from '@/api/members';

export default function DashboardDetail() {
  const router = useRouter();

  const id = router.query.id;
  const fixedId = Array.isArray(id) ? id[id.length - 1] : id;

  const { setHeaderConfig } = useHeader();
  const { user } = useAuth();

  const userId = user?.id;

  const [loading, setLoading] = useState(true);
  const [dashboard, setDashboard] = useState(null);
  const [members, setMembers] = useState([]);

  /* ------------------------------------------
   * Header 설정 (owner 체크)
   ------------------------------------------ */
  useEffect(() => {
    if (!fixedId || !dashboard) return;

    // ⭐ MyDashboard와 동일하게 createdByMe 사용
    const isOwner = dashboard?.createdByMe || false;

    console.log('🔍 대시보드 상세 - isOwner 계산:', {
      createdByMe: dashboard?.createdByMe,
      userId,
      isOwner,
      dashboard: dashboard?.title,
    });

    setHeaderConfig({
      headerType: 'header4',
      dashboardName: dashboard?.title || '대시보드 상세',
      sidemenuShow: true,
      showCrown: true,
      isOwner: isOwner, // ⭐ createdByMe 값 사용
      dashboardId: fixedId,
    });
  }, [dashboard, fixedId, userId, setHeaderConfig]);

  /* ------------------------------------------
   * 대시보드 상세 & 구성원 조회
   ------------------------------------------ */
  useEffect(() => {
    if (!router.isReady) return;
    if (!fixedId) return;

    const fetchData = async () => {
      setLoading(true);

      const res = await getDashboardsId(fixedId);
      console.log('📦 API 응답:', res); // ⭐ API 응답 확인
      if (res?.id) setDashboard(res);

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

  if (loading) return <>로딩중...</>;
  if (!dashboard) return <>대시보드를 찾을 수 없습니다.</>;

  return (
    <div style={{ padding: '40px 24px' }}>
      <h1 style={{ fontSize: 24, fontWeight: 600 }}>{dashboard.title}</h1>

      <h2 style={{ marginTop: 40, fontSize: 18 }}>구성원</h2>
      <ul>
        {members.map((m) => (
          <li key={m.id}>{m.nickname || m.name || m.email}</li>
        ))}
      </ul>
    </div>
  );
}
