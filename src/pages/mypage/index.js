// pages/mypage/index.jsx
import { useEffect } from 'react';
import { useHeader } from '@/context/HeaderProvider';
import ProfileCard from '@/components/cardtable/ProfileCard';
import ChangePasswordCard from '@/components/cardtable/ChangePasswordCard';
import BackPageButton from '@/components/button/BackPageButton/BackPageButton';

export default function MyPage() {
  const { setHeaderConfig } = useHeader();

  useEffect(() => {
    setHeaderConfig({
      headerType: 'header5',
      dashboardName: '계정관리',
      showCrown: false,
      isOwner: false,
      sidemenuShow: true,
    });
  }, [setHeaderConfig]);

  return (
    <div className="subPageInner">
      <BackPageButton />
      <ProfileCard />
      <ChangePasswordCard />
    </div>
  );
}
