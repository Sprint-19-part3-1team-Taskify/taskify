import { useDashboard } from '@/context/DashboardProvider';
import User from './User';
import { useAuth } from '@/context/authProvider';

let LIMIT_MEMBERS = 5;
export default function Users() {
  const { user } = useAuth();
  const { members } = useDashboard();

  const visibleMembers = members.slice(0, LIMIT_MEMBERS);
  const RemainMembers = members.length - LIMIT_MEMBERS;
  return (
    members.length > 1 && (
      <div className="userGroup">
        {visibleMembers
          .filter((item) => item.nickname !== user.nickname)
          .map((item) => {
            return <User key={item.userId} value={item.nickname} type="large" hiddenName="true" />;
          })}
        {RemainMembers > 0 && (
          <User value={`${RemainMembers}`} type="large" hiddenName="true" remain />
        )}
      </div>
    )
  );
}
