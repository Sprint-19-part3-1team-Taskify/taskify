import SideMenu from '@/components/sidemenu/SideMenu';

export default function MyDashBoard() {
  return (
    <>
      <SideMenu />
    </>
  );
}
MyDashBoard.headerType = 'header3';
MyDashBoard.dashboardName = '내 대시보드';
MyDashBoard.mainClassName = 'mydashboard';
