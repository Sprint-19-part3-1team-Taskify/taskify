// 인증 체크 유틸리티 함수
export function withAuth(gssp) {
  return async (context) => {
    const { req } = context;
    const token = req.cookies.accessToken;

    // 토큰이 없으면 로그인 페이지로 리다이렉트
    if (!token) {
      return {
        redirect: {
          destination: `/login`,
          permanent: false,
        },
      };
    }

    // 토큰이 있으면 원래 getServerSideProps 실행
    if (gssp) {
      return await gssp(context);
    }

    return {
      props: {},
    };
  };
}
