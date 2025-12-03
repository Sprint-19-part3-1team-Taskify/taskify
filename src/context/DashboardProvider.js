import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/authProvider';
import { getDashboards, postDashboards, putDashboardsId } from '@/api/dashboards';
import { getInvitations, putInvitationsId } from '@/api/invitations';
import { getMembers } from '@/api/members';

const DashboardContext = createContext(null);

export function DashboardProvider({ children }) {
  const { user, isPending } = useAuth();

  const [myDashboards, setMyDashboards] = useState([]);
  const [invitedDashboards, setInvitedDashboards] = useState([]);
  const [loadingMy, setLoadingMy] = useState(true);
  const [loadingInvited, setLoadingInvited] = useState(true);
  const [currentDashboard, setCurrentDashboard] = useState(null);
  const [members, setMembers] = useState([]);

  // 무한스크롤 상태
  const [invitedCursor, setInvitedCursor] = useState(null);
  const [invitedHasMore, setInvitedHasMore] = useState(true);

  const pathname = usePathname();

  /* -------------------------
     helper: 응답 파싱 유틸
     ------------------------- */
  const normalizeList = (res) => {
    if (!res) return [];
    if (Array.isArray(res)) return res;
    if (Array.isArray(res?.dashboards)) return res.dashboards;
    if (Array.isArray(res?.data?.dashboards)) return res.data.dashboards;
    if (Array.isArray(res?.data)) return res.data;
    if (Array.isArray(res?.items)) return res.items;
    return [];
  };

  /* -------------------------
     내 대시보드 조회 (견고하게 파싱 + dedupe + ownerId 주입)
     ------------------------- */
  const loadMyDashboards = useCallback(async () => {
    try {
      setLoadingMy(true);
      const res = await getDashboards({
        navigationMethod: 'pagination',
        page: 1,
        size: 100,
      });

      let list = normalizeList(res);

      // id 보장 + ownerId 주입 (⭐ 수정 포인트: ownerId 추출을 안전하게 하고 createdByMe 계산)
      list = list.map((d) => {
        // 안전하게 ownerId 추출 (여러 API 응답 형식 대응)
        const ownerId =
          d?.ownerId ??
          d?.createdById ??
          (typeof d?.createdBy === 'object' ? d.createdBy?.id : d?.createdBy) ??
          d?.userId ??
          d?.owner?.id ??
          null;

        return {
          ...d,
          id: d?.id ?? d?.dashboardId,
          ownerId,
          createdByMe: ownerId !== null ? Number(ownerId) === Number(user?.id) : false,
        };
      });

      // 중복 제거
      const deduped = [];
      const seen = new Set();
      list.forEach((d) => {
        if (!d?.id) return;
        if (seen.has(d.id)) return;
        seen.add(d.id);
        deduped.push(d);
      });

      setMyDashboards(deduped);
    } catch (err) {
      console.error('❌ 내 대시보드 조회 실패:', err);
      setMyDashboards([]);
    } finally {
      setLoadingMy(false);
    }
  }, [user?.id]);

  /* -------------------------
     초대받은 대시보드 조회 (무한스크롤)
     ------------------------- */
  const loadInvitedDashboards = useCallback(
    async (reset = false) => {
      try {
        setLoadingInvited(true);

        const cursor = reset ? null : invitedCursor;
        const res = await getInvitations({ size: 10, cursorId: cursor });

        const invitations = Array.isArray(res?.invitations)
          ? res.invitations
          : Array.isArray(res?.data)
            ? res.data
            : [];

        const parsed = [];
        const seenIds = new Set();

        invitations.forEach((item) => {
          const id = item?.id;
          if (!id || seenIds.has(id)) return;
          seenIds.add(id);

          parsed.push({
            id,
            dashboardId: item.dashboard?.id ?? item.dashboardId,
            title: item.dashboard?.title ?? item.dashboardTitle ?? '이름 없음',
            inviterName:
              item.inviter?.nickname ??
              item.invitedBy?.name ??
              item.inviterName ??
              item.invitedBy?.email ??
              '알 수 없음',
            inviterEmail:
              item.inviter?.email ?? item.invitedBy?.email ?? item.inviterEmail ?? '알 수 없음',
            status: item.status ?? item.invitationStatus ?? null,
            raw: item,
          });
        });

        if (reset) {
          setInvitedDashboards(parsed);
        } else {
          setInvitedDashboards((prev) => [...prev, ...parsed]);
        }

        setInvitedCursor(res?.cursorId || null);
        setInvitedHasMore(!!res?.cursorId);
      } catch (err) {
        console.error('❌ 초대받은 대시보드 조회 실패:', err);
        if (reset) setInvitedDashboards([]);
      } finally {
        setLoadingInvited(false);
      }
    },
    [invitedCursor],
  );

  /* -------------------------
     대시보드 멤버 목록 조회
     ------------------------- */
  const loadMembers = useCallback(async (dashboardId) => {
    if (!dashboardId) {
      setMembers([]);
      return;
    }

    try {
      const res = await getMembers({ dashboardId });
      setMembers(res.members || []);
    } catch (err) {
      console.error('❌ 대시보드 멤버 목록:', err);
    }
  }, []);

  /* -------------------------
     로그인 상태 변할 때 대시보드 로드
     ------------------------- */
  useEffect(() => {
    if (isPending) return;
    if (!user) {
      setMyDashboards([]);
      setInvitedDashboards([]);
      setCurrentDashboard(null);
      return;
    }

    loadMyDashboards();
    loadInvitedDashboards(true);
  }, [isPending, user, loadMyDashboards, loadInvitedDashboards]);

  /* -------------------------
     URL 변경 시 currentDashboard 설정
     ------------------------- */
  useEffect(() => {
    if (!pathname) return;
    const match = pathname?.match(/\/dashboard\/(\d+)/);
    if (!match) {
      setCurrentDashboard(null);
      setMembers([]);
      return;
    }
    const dashboardId = Number(match[1]);
    const found = myDashboards.find((d) => Number(d.id) === Number(dashboardId));
    setCurrentDashboard(found || null);
  }, [pathname, myDashboards]);

  /* -------------------------
   currentDashboard 변경 시 멤버 자동 로드 (👈 이게 핵심!)
   ------------------------- */
  useEffect(() => {
    if (currentDashboard?.id) {
      loadMembers(currentDashboard.id);
    } else {
      setMembers([]); // 대시보드 없으면 멤버도 비우기
    }
  }, [currentDashboard?.id, loadMembers]);

  /* -------------------------
     대시보드 수정
     ------------------------- */
  const updateDashboard = useCallback(
    async ({ id, title, color }) => {
      try {
        await putDashboardsId(id, { title, color });

        setMyDashboards((prev) =>
          prev.map((d) => (Number(d.id) === Number(id) ? { ...d, title, color } : d)),
        );

        if (currentDashboard?.id === id) {
          setCurrentDashboard((prev) => ({ ...prev, title, color }));
        }
      } catch (err) {
        console.error('❌ 대시보드 수정 실패:', err);
      }
    },
    [currentDashboard],
  );

  /* -------------------------
     대시보드 생성
     ------------------------- */
  const createDashboard = useCallback(
    async ({ title, color }) => {
      try {
        const res = await postDashboards({ title, color });
        const newDashboard = res?.dashboard || res;

        if (newDashboard?.id) {
          setMyDashboards((prev) => {
            if (prev.some((d) => Number(d.id) === Number(newDashboard.id))) return prev;
            // Ensure createdByMe calculation for the freshly created dashboard:
            const ownerId =
              newDashboard?.ownerId ??
              newDashboard?.createdById ??
              (typeof newDashboard?.createdBy === 'object'
                ? newDashboard.createdBy?.id
                : newDashboard?.createdBy) ??
              newDashboard?.userId ??
              newDashboard?.owner?.id ??
              user?.id ??
              null;

            const enriched = {
              ...newDashboard,
              id: newDashboard.id ?? newDashboard.dashboardId,
              ownerId,
              createdByMe: ownerId !== null ? Number(ownerId) === Number(user?.id) : true,
            };

            return [enriched, ...prev];
          });
          setCurrentDashboard(newDashboard);
        }

        await loadMyDashboards();
      } catch (err) {
        console.error('❌ 대시보드 생성 실패:', err);
      }
    },
    [loadMyDashboards, user?.id],
  );

  /* -------------------------
     초대 수락
     ------------------------- */
  const acceptInvitation = useCallback(
    async (id) => {
      try {
        await putInvitationsId(id, true);

        setInvitedDashboards((prev) => prev.filter((i) => Number(i.id) !== Number(id)));

        await loadMyDashboards();
      } catch (err) {
        console.error('❌ 초대 수락 실패:', err);
      }
    },
    [loadMyDashboards],
  );

  /* -------------------------
     초대 거절
     ------------------------- */
  const rejectInvitation = useCallback(async (id) => {
    try {
      await putInvitationsId(id, false);
      setInvitedDashboards((prev) => prev.filter((i) => Number(i.id) !== Number(id)));
    } catch (err) {
      console.error('❌ 초대 거절 실패:', err);
    }
  }, []);

  return (
    <DashboardContext.Provider
      value={{
        myDashboards,
        setMyDashboards,
        invitedDashboards,
        loadingMy,
        loadingInvited,
        currentDashboard,
        members,
        setCurrentDashboard,
        loadMyDashboards,
        loadInvitedDashboards,
        invitedHasMore,
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
