'use client';

import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { usePathname } from 'next/navigation';
import { getDashboards, postDashboards, putDashboardsId } from '@/api/dashboards';
import { getInvitations, putInvitationsId } from '@/api/invitations';

const DashboardContext = createContext(null);

export function DashboardProvider({ children }) {
  const [myDashboards, setMyDashboards] = useState([]);
  const [invitedDashboards, setInvitedDashboards] = useState([]);
  const [loadingMy, setLoadingMy] = useState(true);
  const [loadingInvited, setLoadingInvited] = useState(true);
  const [currentDashboard, setCurrentDashboard] = useState(null);

  const pathname = usePathname();

  const loadMyDashboards = useCallback(async () => {
    try {
      setLoadingMy(true);
      const res = await getDashboards({ navigationMethod: 'pagination', page: 1, size: 100 });
      setMyDashboards(res?.dashboards || []);
    } catch (err) {
      console.error('❌ 내 대시보드 조회 실패:', err);
    } finally {
      setLoadingMy(false);
    }
  }, []);

  const loadInvitedDashboards = useCallback(async () => {
    try {
      setLoadingInvited(true);
      const res = await getInvitations({ size: 100 });
      setInvitedDashboards(Array.isArray(res?.invitations) ? res.invitations : []);
    } catch (err) {
      console.error('❌ 초대받은 대시보드 조회 실패:', err);
    } finally {
      setLoadingInvited(false);
    }
  }, []);

  useEffect(() => {
    const match = pathname.match(/\/dashboard\/(\d+)/);
    if (!match) return;
    const id = Number(match[1]);
    if (!id) return;
    const found = myDashboards.find((d) => d.id === id);
    setCurrentDashboard(found || null);
  }, [pathname, myDashboards]);

  const updateDashboard = useCallback(
    async ({ id, title, color }) => {
      try {
        await putDashboardsId(id, { title, color });
        setMyDashboards((prev) => prev.map((d) => (d.id === id ? { ...d, title, color } : d)));
        if (currentDashboard?.id === id) setCurrentDashboard((prev) => ({ ...prev, title, color }));
      } catch (err) {
        console.error('❌ 대시보드 수정 실패:', err);
      }
    },
    [currentDashboard],
  );

  const createDashboard = useCallback(
    async ({ title, color }) => {
      try {
        const res = await postDashboards({ title, color });
        const newDashboard = res?.dashboard || res;
        if (newDashboard?.id) {
          setMyDashboards((prev) => [newDashboard, ...prev]);
          setCurrentDashboard(newDashboard);
        }
        await loadMyDashboards();
      } catch (err) {
        console.error('❌ 대시보드 생성 실패:', err);
      }
    },
    [loadMyDashboards],
  );

  const acceptInvitation = useCallback(
    async (id) => {
      try {
        await putInvitationsId(id, true);
        await loadInvitedDashboards();
      } catch (err) {
        console.error('❌ 초대 수락 실패:', err);
      }
    },
    [loadInvitedDashboards],
  );

  const rejectInvitation = useCallback(
    async (id) => {
      try {
        await putInvitationsId(id, false);
        await loadInvitedDashboards();
      } catch (err) {
        console.error('❌ 초대 거절 실패:', err);
      }
    },
    [loadInvitedDashboards],
  );

  useEffect(() => {
    loadMyDashboards();
    loadInvitedDashboards();
  }, [loadMyDashboards, loadInvitedDashboards]);

  return (
    <DashboardContext.Provider
      value={{
        myDashboards,
        setMyDashboards, // ⭐ setter 포함
        invitedDashboards,
        loadingMy,
        loadingInvited,
        currentDashboard,
        setCurrentDashboard, // 이미 있음
        loadMyDashboards,
        loadInvitedDashboards,
        createDashboard,
        updateDashboard,
        acceptInvitation,
        rejectInvitation,
      }}
    >
      {children}
    </DashboardContext.Provider>
  );
}

export const useDashboard = () => useContext(DashboardContext);
