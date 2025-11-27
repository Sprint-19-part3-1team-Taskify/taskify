import { withAuth } from '@/lib/auth';

export default function MyDashBoard() {
  return <>dashboard</>;
}

MyDashBoard.headerType = 'header3';
MyDashBoard.dashboardName = '내 대시보드';
MyDashBoard.mainClassName = 'mydashboard';
MyDashBoard.sidemenuShow = true;

export const getServerSideProps = withAuth();
