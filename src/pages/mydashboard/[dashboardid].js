import SideMenu from '@/components/sidemenu/SideMenu';
import { withAuth } from '@/lib/auth';

export default function MyDashBoard() {
  return <>상세</>;
}

MyDashBoard.headerType = 'header5';
MyDashBoard.dashboardName = '내 대시보드';
MyDashBoard.mainClassName = 'mydashboard';
MyDashBoard.sidemenuShow = true;

export const getServerSideProps = withAuth();
