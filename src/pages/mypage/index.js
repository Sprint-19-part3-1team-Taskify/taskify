import ProfileCard from '@/components/cardtable/ProfileCard';
import ChangePasswordCard from '@/components/cardtable/ChangePasswordCard';
import BackPageButton from '@/components/button/BackPageButton/BackPageButton';

export default function MyPage() {
  return (
    <div className="subPageInner">
      <BackPageButton />
      <ProfileCard />
      <ChangePasswordCard />
    </div>
  );
}
MyPage.headerType = 'header';
MyPage.dashboardName = '계정관리';
