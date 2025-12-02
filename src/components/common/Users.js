import { useDashboard } from '@/context/DashboardProvider';
import User from './User';
import { useAuth } from '@/context/authProvider';

let LIMIT_MEMBERS = 5;
export default function Users() {
  const { user } = useAuth();
  const { members } = useDashboard();

  const safeMembers = Array.isArray(members) ? members : [];
  const visibleMembers = safeMembers.slice(0, LIMIT_MEMBERS);
  const RemainMembers = Math.max(0, safeMembers.length - LIMIT_MEMBERS);
  return (
    safeMembers.length > 1 && (
      <div className="userGroup">
        {visibleMembers
          .filter((item) =>
            item && item.nickname && user?.nickname !== undefined
              ? item.nickname !== user.nickname
              : true,
          )
          .map((item) => {
            return (
              <User
                key={item?.userId ?? `${item?.nickname ?? 'unknown'}-${Math.random()}`}
                value={item?.nickname ?? ''}
                profileImageUrl={item?.profileImageUrl}
                type="large"
                hiddenName="true"
              />
            );
          })}
        {RemainMembers > 0 && (
          <User value={`${RemainMembers}`} type="large" hiddenName="true" remain />
        )}
      </div>
    )
  );
}
