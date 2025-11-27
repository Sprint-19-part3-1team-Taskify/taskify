import ProfileCard from '@/components/cardtable/ProfileCard';
import ChangePasswordCard from '@/components/cardtable/ChangePasswordCard';

export default function MyPage() {
  return (
    <div className="subPageInner">
      <ProfileCard />
      <ChangePasswordCard />
    </div>
  );
}
MyPage.headerType = 'header';
MyPage.dashboardName = '계정관리';
