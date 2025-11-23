'use client';

// Auth API
import { postAuthLogin, putAuthPassword } from '@/api/auth';

// Cards API
import { postCards, getCards, putCardsId, getCardsId, deleteCardsId } from '@/api/cards';

// Columns API
import {
  postColumns,
  getColumns,
  putColumnsId,
  deleteColumnsId,
  postColumnsIdCardImage,
} from '@/api/columns';

// Comments API
import { postComments, getComments, putCommentsId, deleteCommentsId } from '@/api/comments';

// Dashboards API
import {
  postDashboards,
  getDashboards,
  getDashboardsId,
  putDashboardsId,
  deleteDashboardsId,
  postDashboardsIdInvitations,
  getDashboardsIdInvitations,
  deleteDashboardsIdInvitations,
} from '@/api/dashboards';

// Invitations API
import { getInvitations, putInvitationsId } from '@/api/invitations';

// Members API
import { getMembers, deleteMembersId } from '@/api/members';

// Users API
import { postUsers, getUsersMe, putUsersMe, postUsersMeImage } from '@/api/users';

export default function ApiExamplePage() {
  // Auth API handlers
  const handlePostAuthLogin = async () => {
    const response = await postAuthLogin({ email: 'test@example.com', password: 'password123' });
    console.log('POST /auth/login', response);
  };

  const handlePutAuthPassword = async () => {
    const response = await putAuthPassword({
      password: 'password123',
      newPassword: 'newpassword123',
    });
    console.log('PUT /auth/password', response);
  };

  // Cards API handlers
  const handlePostCards = async () => {
    const response = await postCards({
      assigneeUserId: 1,
      dashboardId: 1,
      columnId: 1,
      title: '테스트 카드',
      description: '테스트 설명',
      dueDate: '2024-12-31',
      tags: ['태그1', '태그2'],
      imageUrl: null,
    });
    console.log('POST /cards', response);
  };

  const handleGetCards = async () => {
    const response = await getCards({ columnId: 1 });
    console.log('GET /cards', response);
  };

  const handlePutCardsId = async () => {
    const response = await putCardsId(1, {
      columnId: 1,
      assigneeUserId: 1,
      title: '수정된 카드',
      description: '수정된 설명',
      dueDate: '2024-12-31',
      tags: ['태그1', '태그2'],
      imageUrl: null,
    });
    console.log('PUT /cards/:cardId', response);
  };

  const handleGetCardsId = async () => {
    const response = await getCardsId(1);
    console.log('GET /cards/:cardId', response);
  };

  const handleDeleteCardsId = async () => {
    const response = await deleteCardsId(1);
    console.log('DELETE /cards/:cardId', response);
  };

  // Columns API handlers
  const handlePostColumns = async () => {
    const response = await postColumns({ title: '테스트 컬럼', dashboardId: 1 });
    console.log('POST /columns', response);
  };

  const handleGetColumns = async () => {
    const response = await getColumns(1);
    console.log('GET /columns', response);
  };

  const handlePutColumnsId = async () => {
    const response = await putColumnsId(1, '수정된 컬럼');
    console.log('PUT /columns/:columnId', response);
  };

  const handleDeleteColumnsId = async () => {
    const response = await deleteColumnsId(1);
    console.log('DELETE /columns/:columnId', response);
  };

  const handlePostColumnsIdCardImage = async () => {
    // File input을 통한 이미지 업로드 예제
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = async (e) => {
      const file = e.target.files[0];
      if (file) {
        const response = await postColumnsIdCardImage(1, file);
        console.log('POST /columns/:columnId/card-image', response);
      }
    };
    input.click();
  };

  // Comments API handlers
  const handlePostComments = async () => {
    const response = await postComments({
      content: '테스트 댓글',
      cardId: 1,
      columnId: 1,
      dashboardId: 1,
    });
    console.log('POST /comments', response);
  };

  const handleGetComments = async () => {
    const response = await getComments({ cardId: 1 });
    console.log('GET /comments', response);
  };

  const handlePutCommentsId = async () => {
    const response = await putCommentsId(1, '수정된 댓글');
    console.log('PUT /comments/:commentId', response);
  };

  const handleDeleteCommentsId = async () => {
    const response = await deleteCommentsId(1);
    console.log('DELETE /comments/:commentId', response);
  };

  // Dashboards API handlers
  const handlePostDashboards = async () => {
    const response = await postDashboards({ title: '테스트 대시보드', color: '#7AC555' });
    console.log('POST /dashboards', response);
  };

  const handleGetDashboards = async () => {
    const response = await getDashboards({ navigationMethod: 'pagination' });
    // navigationMethod: 'infiniteScroll', 'pagination'
    console.log('GET /dashboards', response);
  };

  const handleGetDashboardsId = async () => {
    const response = await getDashboardsId(1);
    console.log('GET /dashboards/:dashboardId', response);
  };

  const handlePutDashboardsId = async () => {
    const response = await putDashboardsId(1, { title: '수정된 대시보드', color: '#760DDE' });
    console.log('PUT /dashboards/:dashboardId', response);
  };

  const handleDeleteDashboardsId = async () => {
    const response = await deleteDashboardsId(1);
    console.log('DELETE /dashboards/:dashboardId', response);
  };

  const handlePostDashboardsIdInvitations = async () => {
    const response = await postDashboardsIdInvitations(1, 'test@example.com');
    console.log('POST /dashboards/:dashboardId/invitations', response);
  };

  const handleGetDashboardsIdInvitations = async () => {
    const response = await getDashboardsIdInvitations(1);
    console.log('GET /dashboards/:dashboardId/invitations', response);
  };

  const handleDeleteDashboardsIdInvitations = async () => {
    const response = await deleteDashboardsIdInvitations(1, 1);
    console.log('DELETE /dashboards/:dashboardId/invitations/:invitationId', response);
  };

  // Invitations API handlers
  const handleGetInvitations = async () => {
    const response = await getInvitations();
    console.log('GET /invitations', response);
  };

  const handlePutInvitationsId = async () => {
    const response = await putInvitationsId(1, true);
    console.log('PUT /invitations/:invitationId', response);
  };

  // Members API handlers
  const handleGetMembers = async () => {
    const response = await getMembers({ dashboardId: 1 });
    console.log('GET /members', response);
  };

  const handleDeleteMembersId = async () => {
    const response = await deleteMembersId(1);
    console.log('DELETE /members/:memberId', response);
  };

  // Users API handlers
  const handlePostUsers = async () => {
    const response = await postUsers({
      email: 'test@example.com',
      nickname: '테스트유저',
      password: 'password123',
    });
    console.log('POST /users', response);
  };

  const handleGetUsersMe = async () => {
    const response = await getUsersMe();
    console.log('GET /users/me', response);
  };

  const handlePutUsersMe = async () => {
    const response = await putUsersMe({ nickname: '수정된닉네임', profileImageUrl: null });
    console.log('PUT /users/me', response);
  };

  const handlePostUsersMeImage = async () => {
    // File input을 통한 이미지 업로드 예제
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = async (e) => {
      const file = e.target.files[0];
      if (file) {
        const response = await postUsersMeImage(file);
        console.log('POST /users/me/image', response);
      }
    };
    input.click();
  };

  return (
    <div>
      <h1>API Examples</h1>

      {/* Auth API */}
      <section>
        <h2>Auth API</h2>
        <button onClick={handlePostAuthLogin}>로그인 POST /auth/login</button>
        <br />
        <button onClick={handlePutAuthPassword}>비밀번호 변경 PUT /auth/password</button>
      </section>

      {/* Cards API */}
      <section>
        <h2>Cards API</h2>
        <button onClick={handlePostCards}>카드 생성 POST /cards</button>
        <br />
        <button onClick={handleGetCards}>카드 목록 조회 GET /cards</button>
        <br />
        <button onClick={handlePutCardsId}>카드 수정 PUT /cards/:cardId</button>
        <br />
        <button onClick={handleGetCardsId}>카드 상세 조회 GET /cards/:cardId</button>
        <br />
        <button onClick={handleDeleteCardsId}>카드 삭제 DELETE /cards/:cardId</button>
      </section>

      {/* Columns API */}
      <section>
        <h2>Columns API</h2>
        <button onClick={handlePostColumns}>컬럼 생성 POST /columns</button>
        <br />
        <button onClick={handleGetColumns}>컬럼 목록 조회 GET /columns</button>
        <br />
        <button onClick={handlePutColumnsId}>컬럼 수정 PUT /columns/:columnId</button>
        <br />
        <button onClick={handleDeleteColumnsId}>컬럼 삭제 DELETE /columns/:columnId</button>
        <br />
        <button onClick={handlePostColumnsIdCardImage}>
          카드 이미지 업로드 POST /columns/:columnId/card-image
        </button>
      </section>

      {/* Comments API */}
      <section>
        <h2>Comments API</h2>
        <button onClick={handlePostComments}>댓글 생성 POST /comments</button>
        <br />
        <button onClick={handleGetComments}>댓글 목록 조회 GET /comments</button>
        <br />
        <button onClick={handlePutCommentsId}>댓글 수정 PUT /comments/:commentId</button>
        <br />
        <button onClick={handleDeleteCommentsId}>댓글 삭제 DELETE /comments/:commentId</button>
      </section>

      {/* Dashboards API */}
      <section>
        <h2>Dashboards API</h2>
        <button onClick={handlePostDashboards}>대시보드 생성 POST /dashboards</button>
        <br />
        <button onClick={handleGetDashboards}>대시보드 목록 조회 GET /dashboards</button>
        <br />
        <button onClick={handleGetDashboardsId}>
          대시보드 상세 조회 GET /dashboards/:dashboardId
        </button>
        <br />
        <button onClick={handlePutDashboardsId}>대시보드 수정 PUT /dashboards/:dashboardId</button>
        <br />
        <button onClick={handleDeleteDashboardsId}>
          대시보드 삭제 DELETE /dashboards/:dashboardId
        </button>
        <br />
        <button onClick={handlePostDashboardsIdInvitations}>
          대시보드 초대하기 POST /dashboards/:dashboardId/invitations
        </button>
        <br />
        <button onClick={handleGetDashboardsIdInvitations}>
          대시보드 초대 불러오기 GET /dashboards/:dashboardId/invitations
        </button>
        <br />
        <button onClick={handleDeleteDashboardsIdInvitations}>
          대시보드 초대 취소 DELETE /dashboards/:dashboardId/invitations/:invitationId
        </button>
      </section>

      {/* Invitations API */}
      <section>
        <h2>Invitations API</h2>
        <button onClick={handleGetInvitations}>내가 받은 초대 목록 조회 GET /invitations</button>
        <br />
        <button onClick={handlePutInvitationsId}>초대 응답 PUT /invitations/:invitationId</button>
      </section>

      {/* Members API */}
      <section>
        <h2>Members API</h2>
        <button onClick={handleGetMembers}>대시보드 멤버 목록 조회 GET /members</button>
        <br />
        <button onClick={handleDeleteMembersId}>
          대시보드 멤버 삭제 DELETE /members/:memberId
        </button>
      </section>

      {/* Users API */}
      <section>
        <h2>Users API</h2>
        <button onClick={handlePostUsers}>회원 가입 POST /users</button>
        <br />
        <button onClick={handleGetUsersMe}>내 정보 조회 GET /users/me</button>
        <br />
        <button onClick={handlePutUsersMe}>내 정보 수정 PUT /users/me</button>
        <br />
        <button onClick={handlePostUsersMeImage}>프로필 이미지 업로드 POST /users/me/image</button>
      </section>
    </div>
  );
}
