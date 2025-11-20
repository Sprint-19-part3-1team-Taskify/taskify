import SideMenu from '@/components/layout/SideMenu/index';

export default function MyDashBoard() {
  return (
    <>
      <SideMenu />
    </>
  );
}
MyDashBoard.headerType = 'header5';
MyDashBoard.dashboardName = '내 대시보드';
MyDashBoard.mainClassName = 'mydashboard';
